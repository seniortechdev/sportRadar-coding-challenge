import fs from "fs";
import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
});

const dropTables = async (client: Client) => {
  const query = `DO $$ DECLARE r RECORD; BEGIN FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP EXECUTE 'DROP TABLE IF EXISTS ' || r.tablename || ' CASCADE'; END LOOP; END $$;`;
  await client.query(query);
  console.log("All tables dropped successfully");
};

const dropSchema = async (client: Client, schemaName: string) => {
  const query = `DROP SCHEMA IF EXISTS ${schemaName} CASCADE;`;
  await client.query(query);
  console.log(`Schema "${schemaName}" dropped successfully`);
};

const populateDB = async (client: Client) => {
  fs.readFile("data/schema.sql", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading .sql file", err);
      process.exit(1);
    }
    client
      .query(data)
      .then((res: any) => {
        console.log("Data imported successfully!");
        client.end();
      })
      .catch((err: any) => {
        console.error("Error executing .sql file", err);
        process.exit(1);
      });
  });
};

client
  .connect()
  .then(async () => {
    console.log("Connected to PostgreSQL");
    if (process.argv[2] === "--reset") {
      await dropTables(client);
      await dropSchema(client, "nhl_data_pipeline");
      await populateDB(client);
    } else {
      await populateDB(client);
    }
  })
  .catch((err) => {
    console.error("Connection error", err.stack);
    process.exit(1);
  });
