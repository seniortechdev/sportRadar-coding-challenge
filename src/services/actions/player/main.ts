import axios from "axios";
import { insertPlayer } from "../db/playerActions";
import { ParsedPlayer, PlayerFeed, Player } from "@interfaces/Player";

export class Players {
  private async getPlayersByGameId(gameId: number): Promise<Player[]> {
    try {
      const response = await axios.get(
        `https://statsapi.web.nhl.com/api/v1/game/${gameId}/feed/live`
      );
      if (response && response.status === 200) {
        if (Object.keys(response.data.gameData.players).length > 0) {
          const players: Player[] = [];
          const playersFeed: PlayerFeed = response.data.gameData.players;
          for (const key in playersFeed) {
            players.push(playersFeed[key]);
          }
          return players;
        }
        console.log("No players found");
        return [];
      }
      new Error("No response from NHL API");
    } catch (error) {
      console.log(error);
      return [];
    }
    return Promise.resolve([]);
  }

  private parsePlayersForDB(players: Player[]) {
    const parsedPlayers: ParsedPlayer[] = [];
    players.map((player: Player) => {
      return parsedPlayers.push({
        playerId: player.id,
        firstName: player.firstName,
        lastName: player.lastName,
        age: player.currentAge,
        number: player.primaryNumber,
        position: player.primaryPosition.name,
        teamId: player.currentTeam?.id || 0,
      });
    });
    return parsedPlayers;
  }

  public async insertPlayers(gameId: number): Promise<void> {
    const players = await this.getPlayersByGameId(gameId);
    if (players.length < 1) {
      console.log("No players found");
      return;
    } else {
      const parsedPlayers = this.parsePlayersForDB(players);
      await insertPlayer(parsedPlayers);
    }
  }

  public async insertPlayersWithDelay(
    gameIds: number[],
    delay: number
  ): Promise<void> {
    await this.insertPlayers(gameIds[0]);
    if (gameIds.length > 1) {
      setTimeout(() => {
        this.insertPlayersWithDelay(gameIds.slice(1), delay);
      }, delay);
    }
    return Promise.resolve();
  }
}
