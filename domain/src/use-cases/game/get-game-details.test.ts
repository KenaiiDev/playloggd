import { beforeEach, describe, expect, it } from "vitest";
import { mockReset } from "vitest-mock-extended";

import { createMockGame } from "@/entities/__mocks__/mock-game";
import { createGameServiceMock } from "@/services/__mocks__/";
import { getGameDetails } from "./get-game-details";

describe("Get Game Details Use Case", () => {
  const mockGame = createMockGame({
    title: "The Last of Us",
    externalId: "game-123",
  });

  const gameService = createGameServiceMock();

  beforeEach(() => {
    mockReset(gameService);
  });

  it("should return success with game details when game is found", async () => {
    const gameId = "game-123";
    gameService.getGameById.mockResolvedValue(mockGame);

    const result = await getGameDetails({
      dependencies: { gameService },
      payload: { gameId },
    });

    expect(result).toStrictEqual(mockGame);
    expect(gameService.getGameById).toHaveBeenCalledWith(gameId);
  });

  it("should return error when game is not found", async () => {
    const gameId = "non-existent-game";
    gameService.getGameById.mockResolvedValue(undefined);

    const result = await getGameDetails({
      dependencies: { gameService },
      payload: { gameId },
    });

    expect(result).toBeInstanceOf(Error);
  });

  it("should return error when gameId is empty", async () => {
    const gameId = "";

    const result = await getGameDetails({
      dependencies: { gameService },
      payload: { gameId },
    });

    expect(result).toBeInstanceOf(Error);
    expect(gameService.getGameById).not.toHaveBeenCalled();
  });
});
