import { beforeEach, describe, expect, it } from "vitest";
import { mockReset } from "vitest-mock-extended";

import { createMockGame } from "@/entities/__mocks__/mock-game";
import { createGameServiceMock } from "@/services/__mocks__/";
import { getMostPopularGames } from "./get-most-popular-games";

describe("Get Most Popular Games Use Case", () => {
  const mockGames = [
    createMockGame({ title: "The Last of Us", rating: 95 }),
    createMockGame({ title: "God of War", rating: 92 }),
    createMockGame({ title: "Red Dead Redemption 2", rating: 90 }),
  ];

  const gameService = createGameServiceMock();

  beforeEach(() => {
    mockReset(gameService);
  });

  it("should return most popular games when request is successful", async () => {
    gameService.getMostPopularGames.mockResolvedValue(mockGames);

    const result = await getMostPopularGames({
      dependencies: { gameService },
      payload: { limit: 3 },
    });

    if (!Array.isArray(result)) {
      throw new Error("Expected result to be an array of games");
    }

    expect(result).toHaveLength(3);
    expect(gameService.getMostPopularGames).toHaveBeenCalledWith(3);
    expect(result).toEqual(mockGames);
  });

  it("should return empty array when no games are found", async () => {
    gameService.getMostPopularGames.mockResolvedValue([]);

    const result = await getMostPopularGames({
      dependencies: { gameService },
      payload: { limit: 3 },
    });

    expect(result).toHaveLength(0);
    expect(gameService.getMostPopularGames).toHaveBeenCalledWith(3);
  });

  it("should use default limit when no limit is provided", async () => {
    gameService.getMostPopularGames.mockResolvedValue(mockGames.slice(0, 2));

    const result = await getMostPopularGames({
      dependencies: { gameService },
      payload: {},
    });

    expect(result).toHaveLength(2);
    expect(gameService.getMostPopularGames).toHaveBeenCalledWith(10);
  });

  it("should throw error when service fails", async () => {
    const error = new Error("Service error");
    gameService.getMostPopularGames.mockRejectedValue(error);

    await expect(
      getMostPopularGames({
        dependencies: { gameService },
        payload: { limit: 3 },
      })
    ).rejects.toThrow("Service error");
  });
});
