import db from "../../config/db/db";
import {
  getGames,
  deleteGames,
  insertGame,
} from "../../services/actions/db/gameActions";
jest.mock("../../config/db/db", () => {
  return {
    query: jest.fn().mockResolvedValue({ rows: [], rowCount: 1 }),
  };
});
describe("Games", () => {
  describe("getGames", () => {
    it("should get games from the database", async () => {
      const gameIds = [1, 2, 3];
      await getGames(gameIds);
      expect(db.query).toHaveBeenCalled();
    });
  });
  describe("deleteGames", () => {
    it("should delete games from the database", async () => {
      const gamesArray = [1, 2, 3];
      await deleteGames(gamesArray);
      expect(db.query).toHaveBeenCalled();
      expect(db.query).toHaveBeenCalledTimes(2);
    });
  });
  describe("insertGame", () => {
    it("should insert a game into the database", async () => {
      const game = [
        {
          gameId: 123,
          gameDate: new Date("2023-02-01T16:10:30.000Z"),
          homeTeamId: 123,
          awayTeamId: 456,
        },
      ];
      await insertGame(game);
      expect(db.query).toHaveBeenCalled();
    });
  });
});
