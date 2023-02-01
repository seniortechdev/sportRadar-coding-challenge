import { ParsedGame } from "@interfaces/Game";
import { StatementGenerator } from "../../../utils/index";
import pool from "../../../config/db/db";

const getGames = async (games: number[]): Promise<void> => {
  const preparedGames = games.map((_game, i) => `$${i + 1}`).join(",");
  const query = `
    SELECT * FROM nhl_data_pipeline.games
    WHERE game_id = ${preparedGames}
    `;
  try {
    const res = await pool.query(query, games);
    if (res && res.rowCount > 0) {
      return res.rows as any;
    }
    throw new Error("No rows returned");
  } catch (err) {
    throw new Error(`Error inserting game: ${err}`);
  }
};

const deleteGames = async (games: number[]): Promise<void> => {
  const preparedGames = games.map((_game, i) => `$${i + 1}`).join(",");
  const query = `
        DELETE FROM nhl_data_pipeline.games
        WHERE game_id = ${preparedGames}
    `;
  try {
    pool.query(query, games);
  } catch (err) {
    throw new Error(`Error deleting game: ${err}`);
  }
};

const insertGame = async (games: ParsedGame[]): Promise<void> => {
  const preparedStatement = StatementGenerator<ParsedGame>(games);
  const query = `
    INSERT INTO nhl_data_pipeline.games(game_id, game_date, home_team_id, away_team_id, home_team_score, away_team_score)
    VALUES ${preparedStatement}
    ON CONFLICT (game_id) DO UPDATE SET
        game_date = EXCLUDED.game_date,
        home_team_id = EXCLUDED.home_team_id,
        away_team_id = EXCLUDED.away_team_id,
    `;
  const flattenedGames = games.map((game) => Object.values(game)).flat();
  try {
    console.log(`Inserting game ${games[0].gameId} into database`);
    pool.query(query, flattenedGames);
  } catch (err) {
    throw new Error(`Error inserting game: ${err}`);
  }
};

export { getGames, deleteGames, insertGame };
