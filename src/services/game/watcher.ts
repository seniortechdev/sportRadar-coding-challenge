import { GameWatcher } from "./main";
import { nowInUtc } from "../../utils/index";
import { differenceInMinutes } from "date-fns";

export class Watcher {
  static initializedGame: GameWatcher;
  static timeDelay: number = 1000 * 60 * 5;

  static async watchGame(gameId: number, startTime: Date) {
    const nowUCT = nowInUtc();
    const timeDiff = differenceInMinutes(nowUCT, startTime);

    console.log(
      `${
        timeDiff > 5
          ? `Waiting for game with id ${gameId} to start`
          : `Watching game with id ${gameId}`
      }`
    );

    if (this.initializedGame && timeDiff < 5) {
      this.initializedGame = new GameWatcher(gameId);
      console.log(`Watching game with id ${gameId}`);
    } else {
      setTimeout(
        () => this.watchGame(gameId, startTime),
        this.timeDelay
      ).unref();
    }

    if (this.initializedGame) {
      this.timeDelay = 1000 * 60 * 1;
      this.initializedGame.insertPlays();
    } else {
      setTimeout(
        () => this.watchGame(gameId, startTime),
        this.timeDelay
      ).unref();
    }

    // exit if game has ended
    if (this.initializedGame?.gameEnded) {
      console.log(`Game ${gameId} has ended`);
      process.exit(0);
    }

    // if game has not started, wait 5 minutes and try again
    if (timeDiff < 5) {
      setTimeout(
        () => this.watchGame(gameId, startTime),
        this.timeDelay
      ).unref();
    }
  }
}

const argv = process.argv;

if (argv.length < 2) {
  console.log("Please provide a game id and start time to watch");
  process.exit(0);
}

Watcher.watchGame(parseInt(argv[2]), new Date(argv[3]));
