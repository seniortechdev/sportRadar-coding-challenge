import { nowInUtc } from "./../utils/index";
import { Main } from "../index";
jest.useFakeTimers();
jest.mock("node:child_process", () => {
  return {
    exec: (arg1: string, arg2: any) => null,
  };
});
jest.mock("date-fns", () => {
  return {
    differenceInMinutes: () => 20,
  };
});
jest.mock("node-cron", () => {
  return {
    schedule: jest.fn(),
  };
});
jest.mock("child_process", () => {
  return {
    execSync: () => "This is a test message",
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
    expect(players).toHaveBeenCalled();
    expect(schedule).toHaveBeenCalledWith(
      "*/30 4-17 * * *",
      expect.any(Function)
    );
    const cb = schedule.mock.calls[0][1];
    await cb();
    jest.runAllTimers();
  });
});
