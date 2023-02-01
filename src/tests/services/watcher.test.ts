import { nowInUtc } from "../../utils/index";
import { Watcher } from "../../services/game/watcher";

describe("Watcher", () => {
  it("should run the game watcher with the correct date format", () => {
    const spy = jest.spyOn(global.console, "log");
    const gamePk = 123;
    const date = new Date(nowInUtc());
    Watcher.watchGame(gamePk, date);
    expect(spy).toHaveBeenCalledWith(`Watching game with id ${gamePk}`);
    spy.mockRestore();
  });
});
