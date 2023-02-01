import axios from "axios";
import { EventTypes } from "../../utils/watcherUtils";
import { PlayerTypes } from "../../utils/playerUtils";
import { ParsedPlay, ParsedPlayStats, Watcher } from "@interfaces/Watcher";
import { insertPlay, insertPlayStats } from "../actions/db/watcherActions";

export class GameWatcher {
  public gameId: number;
  public gameEnded: boolean;
  public playOffset: number;

  constructor(gameId: number) {
    this.gameId = gameId;
    this.gameEnded = false;
    this.playOffset = 0;
  }

  public async getGameData(): Promise<Watcher[]> {
    const eventTypes: string[] = Object.values(EventTypes);

    console.log(
      `Getting plays for game ${this.gameId} since ${this.playOffset} minutes ago`
    );

    try {
      const res = await axios.get(
        `https://statsapi.web.nhl.com/api/v1/game/${this.gameId}/feed/live`
      );
      if (res && res.status === 200) {
        if (
          res.data.gameData.status.abstractGameState === "Final" ||
          res.data.gameData.dateTime?.endDateTime
        ) {
          this.gameEnded = true;
        }
        const plays: Watcher[] = res.data.liveData.plays.allPlays;
        const filteredPlays: Watcher[] = plays
          .slice(0, plays.length - 1)
          .filter((play: Watcher) =>
            eventTypes.includes(play.result.eventTypeId)
          );
        this.playOffset = plays.length;
        filteredPlays?.length > 0 &&
          console.log(
            `Found ${filteredPlays.length} plays for game ${this.gameId}`
          );
        return filteredPlays;
      }
      throw new Error("No data returned");
    } catch (err) {
      throw new Error(`Error getting game data: ${err}`);
    }
  }

  private parsePlaysForDB(plays: Watcher[]): ParsedPlay[] {
    const parsedPlays: ParsedPlay[] = plays.map((play: Watcher) => {
      return {
        gameId: this.gameId,
        playType: play.result.eventTypeId,
        timeStamp: play.about.dateTime,
        teamId: play.team.id,
      };
    });
    return parsedPlays;
  }

  private parsePlayStats(playerIds: number[], plays: Watcher[]) {
    const playerTypes: string[] = Object.values(PlayerTypes);
    const parsedPlayStats: ParsedPlayStats[] = [];
    for (const [i, play] of plays.entries() as any) {
      const preparedPlayStats = play.players
        .filter((player: { playerType: string }) =>
          playerTypes.includes(player.playerType)
        )
        .map((player: { player: { id: any }; playerType: any }) => {
          return {
            playId: playerIds[i],
            playerId: player.player.id,
            hitValue: player.playerType === PlayerTypes.Hitter ? 1 : 0,
            goalValue: player.playerType === PlayerTypes.Scorer ? 1 : 0,
            assistValue: player.playerType === PlayerTypes.Assist ? 1 : 0,
            penaltyMinutes:
              player.playerType === PlayerTypes.Penalty_On
                ? play.result.penaltyMinutes
                : 0,
            pointValue:
              player.playerType === PlayerTypes.Assist ||
              player.playerType === PlayerTypes.Scorer
                ? 1
                : 0,
          };
        });
      parsedPlayStats.push(...preparedPlayStats);
    }
    return parsedPlayStats;
  }

  public async insertPlays(): Promise<void> {
    const filteredPlays = await this.getGameData();
    if (filteredPlays?.length < 1) {
      return;
    }
    const parsedPlays = this.parsePlaysForDB(filteredPlays);
    if (parsedPlays.length < 1) {
      return;
    }
    const playRes = await insertPlay(parsedPlays);
    if (playRes.length < 1) {
      return;
    }
    const playIds = playRes.map((play) => play.play_id);
    const parsedPlayStats = this.parsePlayStats(playIds, filteredPlays);
    if (parsedPlayStats.length < 1) {
      return;
    }
    await insertPlayStats(parsedPlayStats);
  }
}
