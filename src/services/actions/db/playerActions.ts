import { ParsedPlayer } from "@interfaces/Player";
import { StatementGenerator } from "../../../utils/index";
import pool from "../../../config/db/db";

const insertPlayer = async (players: ParsedPlayer[]): Promise<void> => {
  const preparedStatement = StatementGenerator<ParsedPlayer>(players);
  const query = `
        INSERT INTO nhl_data_pipeline.players(player_id, first_name, last_name, age, number, position, team_id)
        VALUES ${preparedStatement}
        ON CONFLICT (player_id) DO UPDATE SET
            first_name = EXCLUDED.first_name,
            last_name = EXCLUDED.last_name,
            age = EXCLUDED.age,
            number = EXCLUDED.number,
            position = EXCLUDED.position,
            team_id = EXCLUDED.team_id
    `;
  const flattenedPlayers = players
    .map((player) => Object.values(player))
    .flat();
  try {
    console.log(`Inserting player ${players[0].playerId} into database`);
    pool.query(query, flattenedPlayers);
  } catch (err) {
    throw new Error(`Error inserting player: ${err}`);
  }
};

export { insertPlayer };
