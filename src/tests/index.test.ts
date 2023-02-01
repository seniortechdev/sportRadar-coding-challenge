import { nowInUtc } from "./../utils/index";
import { Main } from "../index";
import { execSync } from "child_process";

jest.mock("node-cron", () => {
  return {
    schedule: jest.fn(),
  };
});
jest.mock("../services/actions/game/main", () => {
  return {
    Games: jest.fn().mockImplementation(() => {
      return {
        getGamesToday: jest.fn().mockResolvedValue([]),
        gamesToday: [
          { gamePk: 123, gameDate: new Date(nowInUtc() + 1000 * 60 * 60) },
          { gamePk: 456, gameDate: new Date(nowInUtc() + 1000 * 60 * 60 * 2) },
        ],
        gamesStarted: [],
      };
    }),
  };
});
jest.mock("../services/actions/player/main", () => {
  return {
    Players: jest.fn().mockImplementation(() => {
      return {
        insertPlayersWithDelay: jest.fn().mockResolvedValue(undefined),
      };
    }),
  };
});

describe("Main", () => {
  it("should run the cron job to get games today and insert players with delay", async () => {
    const games = require("../services/actions/game/main").Games;
    const players = require("../services/actions/player/main").Players;
    const schedule = require("node-cron").schedule;

    await Main.run();

    expect(games).toHaveBeenCalled();
    expect(players).toHaveBeenCalledWith(123 + " " + 456);
    expect(schedule).toHaveBeenCalledWith(
      "*/30 4-17 * * *",
      expect.any(Function)
    );

    const cb = schedule.mock.calls[0][1];
    await cb();

    expect(execSync).toHaveBeenCalledWith(
      "yarn run watch 123 " + (nowInUtc() + 1000 * 60 * 60),
      { stdio: "ignore" }
    );
    expect(execSync).toHaveBeenCalledWith(
      "yarn run watch 456 " + (nowInUtc() + 1000 * 60 * 60 * 2),
      { stdio: "ignore" }
    );
  });
});
