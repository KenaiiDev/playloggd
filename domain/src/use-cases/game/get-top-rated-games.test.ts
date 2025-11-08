import { beforeEach, describe, expect, it } from "vitest";
import { mockReset } from "vitest-mock-extended";

import { createMockGame } from "@/entities/__mocks__/mock-game";
import { createGameServiceMock } from "@/services/__mocks__/";
import { getTopRatedGames } from "./get-top-rated-games";

describe("Get Top Rated Games Use Case", () => {
  const mockGames = [
    createMockGame({
      title: "The Last of Us",
      rating: 98,
    }),
    createMockGame({
      title: "Red Dead Redemption 2",
      rating: 97,
    }),
    createMockGame({
      title: "God of War",
      rating: 96,
    }),
  ];

  const gameService = createGameServiceMock();

  beforeEach(() => {
    mockReset(gameService);
  });

  it("should return top rated games when request is successful", async () => {
    gameService.getTopRatedGames.mockResolvedValue(mockGames);

    const result = await getTopRatedGames({
      dependencies: { gameService },
      payload: { limit: 3 },
    });

    if (!Array.isArray(result)) {
      throw new Error("Expected result to be an array of games");
    }

    expect(result).toHaveLength(3);
    expect(gameService.getTopRatedGames).toHaveBeenCalledWith(3);
    expect(result).toEqual(mockGames);
    expect(result[0].rating).toBeGreaterThanOrEqual(result[1].rating);
    expect(result[1].rating).toBeGreaterThanOrEqual(result[2].rating);
  });

  it("should return empty array when no games are found", async () => {
    gameService.getTopRatedGames.mockResolvedValue([]);

    const result = await getTopRatedGames({
      dependencies: { gameService },
      payload: { limit: 3 },
    });

    expect(result).toHaveLength(0);
    expect(gameService.getTopRatedGames).toHaveBeenCalledWith(3);
  });

  it("should use default limit when no limit is provided", async () => {
    gameService.getTopRatedGames.mockResolvedValue(mockGames.slice(0, 2));

    const result = await getTopRatedGames({
      dependencies: { gameService },
      payload: {},
    });

    expect(result).toHaveLength(2);
    expect(gameService.getTopRatedGames).toHaveBeenCalledWith(10);
  });

  it("should throw error when service fails", async () => {
    const error = new Error("Service error");
    gameService.getTopRatedGames.mockRejectedValue(error);

    await expect(
      getTopRatedGames({
        dependencies: { gameService },
        payload: { limit: 3 },
      })
    ).rejects.toThrow("Service error");
  });
});
