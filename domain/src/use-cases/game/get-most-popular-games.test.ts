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

  it("should return paginated popular games when request is successful", async () => {
    gameService.getMostPopularGames.mockResolvedValue({
      data: mockGames,
      pagination: {
        total: 3,
        limit: 10,
        offset: 0,
        hasMore: false,
      },
    });

    const result = await getMostPopularGames({
      dependencies: { gameService },
      payload: { pagination: { limit: 3 } },
    });

    expect(result.data).toHaveLength(3);
    expect(gameService.getMostPopularGames).toHaveBeenCalledWith({ limit: 3 });
    expect(result.data).toEqual(mockGames);
  });

  it("should pass pagination parameters to service", async () => {
    const pagination = { limit: 5, offset: 10 };

    gameService.getMostPopularGames.mockResolvedValue({
      data: mockGames.slice(0, 2),
      pagination: {
        total: 12,
        limit: 5,
        offset: 10,
        hasMore: false,
      },
    });

    const result = await getMostPopularGames({
      dependencies: { gameService },
      payload: { pagination },
    });

    expect(result.data).toHaveLength(2);
    expect(gameService.getMostPopularGames).toHaveBeenCalledWith(pagination);
  });

  it("should return empty data array when no games are found", async () => {
    gameService.getMostPopularGames.mockResolvedValue({
      data: [],
      pagination: {
        total: 0,
        limit: 10,
        offset: 0,
        hasMore: false,
      },
    });

    const result = await getMostPopularGames({
      dependencies: { gameService },
      payload: {},
    });

    expect(result.data).toHaveLength(0);
    expect(gameService.getMostPopularGames).toHaveBeenCalledWith(undefined);
  });

  it("should throw error when service fails", async () => {
    const error = new Error("Service error");
    gameService.getMostPopularGames.mockRejectedValue(error);

    await expect(
      getMostPopularGames({
        dependencies: { gameService },
        payload: { pagination: { limit: 3 } },
      })
    ).rejects.toThrow("Service error");
  });
});
