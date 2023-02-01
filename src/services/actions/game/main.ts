import axios from "axios";
import { format } from "date-fns";
import { insertGame } from "../db/gameActions";
import { Game, ParsedGame } from "@interfaces/Game";

export class Games {
  public gamesToday: Game[];
  public earliestGame: Game;
  public gamesStarted: number[];

  constructor() {
    this.gamesStarted = [];
    this.gamesToday = [];
    this.earliestGame = [] as any;
  }

  public async getGamesToday(): Promise<Game[]> {
    const today = format(new Date(), "yyyy-MM-dd");
    console.log("Getting games for", today);
    try {
      const res = await axios.get(
        `https://statsapi.web.nhl.com/api/v1/schedule?date=${today}`
      );
      if (res && res.status === 200) {
        if (res.data.dates.length > 0) {
          const todaysGames: Game[] = res.data.dates[0].games;
          this.gamesToday = todaysGames;
          this.earliestGame = todaysGames.reduce((prev, current) =>
            prev.gameDate < current.gameDate ? prev : current
          );
          return todaysGames;
        }
      }
      console.log("No games found");
      return [];
    } catch (err) {
      throw new Error(`Error getting games: ${err}`);
    }
  }

  private parseGames(games: Game[]): ParsedGame[] {
    return games.map((game) => {
      return {
        gameId: game.gamePk,
        gameDate: new Date(game.gameDate),
        homeTeamId: game.teams.home.team.id,
        awayTeamId: game.teams.away.team.id,
      };
    });
  }

  public async insertGames(): Promise<void> {
    const games = await this.getGamesToday();
    const parsedGames = this.parseGames(games);
    if (parsedGames.length > 0) {
      await insertGame(parsedGames);
    } else {
      throw new Error("No games to insert");
    }
  }
}
