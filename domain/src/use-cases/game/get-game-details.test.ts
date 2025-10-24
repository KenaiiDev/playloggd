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

  it("should throw error when game is not found", async () => {
    const gameId = "non-existent-game";
    gameService.getGameById.mockResolvedValue(undefined);

    await expect(
      getGameDetails({
        dependencies: { gameService },
        payload: { gameId },
      })
    ).rejects.toThrow(Error);
  });

  it("should throw error when gameId is empty", async () => {
    const gameId = "";

    await expect(
      getGameDetails({
        dependencies: { gameService },
        payload: { gameId },
      })
    ).rejects.toThrow(Error);
    expect(gameService.getGameById).not.toHaveBeenCalled();
  });
});
