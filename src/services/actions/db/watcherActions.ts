import { ParsedPlay, ParsedPlayStats } from "@interfaces/Watcher";
import { StatementGenerator, nowInUtc } from "../../../utils/index";
import pool from "../../../config/db/db";

const insertPlay = async (
  plays: ParsedPlay[]
): Promise<Array<{ play_id: number }>> => {
  const preparedStatement = StatementGenerator<ParsedPlay>(plays);
  const query = `
        INSERT INTO nhl_data_pipeline.plays(game_id, play_type, time_stamp, team_id)
        VALUES ${preparedStatement}
        RETURNING play_id
    `;
  const flattenedPlays = plays
    .map((play: { [s: string]: unknown } | ArrayLike<unknown>) =>
      Object.values(play)
    )
    .flat();

  try {
    const res = await pool.query(query, flattenedPlays);
    if (res && res.rowCount > 0) {
      return res.rows;
    }
    throw new Error("No rows returned");
  } catch (err) {
    throw new Error(`Error inserting play: ${err}`);
  }
};

const insertPlayStats = async (
  playerStats: ParsedPlayStats[]
): Promise<void> => {
  const preparedStatement = StatementGenerator<ParsedPlayStats>(playerStats);
  const query = `
        INSERT INTO nhl_data_pipeline.play_stats(play_id, player_id, hit_value, goal_value, assist_value, point_value, penalty_minutes)
        VALUES ${preparedStatement}
    `;
  const flattenedPlayerStats = playerStats
    .map((stat) => Object.values(stat))
    .flat();

  try {
    await pool.query(query, flattenedPlayerStats);
  } catch (err) {
    throw new Error(`Error inserting play stats: ${err}`);
  }
};

export { insertPlay, insertPlayStats };
