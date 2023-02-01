import cron from "node-cron";
import { exec } from "node:child_process";
import { differenceInMinutes } from "date-fns";
import { Games } from "./services/actions/game/main";
import { Players } from "./services/actions/player/main";
import { nowInUtc } from "./utils/index";

class Main {
  static async run() {
    const games = new Games();
    const players = new Players();

    // cron job to run every 30 minutes from 4am to 5pm
    cron.schedule("*/1 4-17 * * *", async () => {
      await games.getGamesToday();
      if (games.gamesToday.length > 0) {
        const gameIds = games.gamesToday.map((game) => game.gamePk);
        await players.insertPlayersWithDelay(gameIds, 1000);

        setTimeout(() => {
          for (const game of games.gamesToday) {
            const nowUtc = nowInUtc();
            const timeDiff = differenceInMinutes(
              new Date(game.gameDate),
              nowUtc
            );
            if (timeDiff < 30 && !games.gamesStarted.includes(game.gamePk)) {
              console.log(`Staring watch for game ${game.gamePk}`);
              games.gamesStarted.push(game.gamePk);
              exec(
                `yarn run watch -- ${game.gamePk} ${game.gameDate}`,
                (err, stdout, stderr) => {
                  if (err) {
                    console.error(err);
                    return;
                  }
                  console.log(stdout);
                  console.error(stderr);
                }
              );
            }
          }
        }, 2000 * 2 * gameIds.length);
      }
    });
  }
}

Main.run();
