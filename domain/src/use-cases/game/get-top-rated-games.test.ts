import { beforeEach, describe, expect, it } from "vitest";
import { mockReset } from "vitest-mock-extended";

import { createMockGame } from "@/entities/__mocks__/mock-game";
import { createGameServiceMock } from "@/services/__mocks__/";
import { getTopRatedGames } from "./get-top-rated-games";

describe("Get Top Rated Games Use Case", () => {
  const mockGames = [
    createMockGame({ title: "The Last of Us", rating: 98 }),
    createMockGame({ title: "Red Dead Redemption 2", rating: 97 }),
    createMockGame({ title: "God of War", rating: 96 }),
  ];

  const gameService = createGameServiceMock();

  beforeEach(() => {
    mockReset(gameService);
  });

  it("should return paginated top rated games when request is successful", async () => {
    gameService.getTopRatedGames.mockResolvedValue({
      data: mockGames,
      pagination: {
        total: 3,
        limit: 10,
        offset: 0,
        hasMore: false,
      },
    });

    const result = await getTopRatedGames({
      dependencies: { gameService },
      payload: { pagination: { limit: 3 } },
    });

    expect(result.data).toHaveLength(3);
    expect(gameService.getTopRatedGames).toHaveBeenCalledWith({ limit: 3 });
    expect(result.data).toEqual(mockGames);
    expect(result.data[0].rating).toBeGreaterThanOrEqual(
      result.data[1].rating!
    );
    expect(result.data[1].rating).toBeGreaterThanOrEqual(
      result.data[2].rating!
    );
  });

  it("should pass pagination parameters to service", async () => {
    const pagination = { limit: 5, offset: 10 };

    gameService.getTopRatedGames.mockResolvedValue({
      data: mockGames.slice(0, 2),
      pagination: {
        total: 12,
        limit: 5,
        offset: 10,
        hasMore: false,
      },
    });

    const result = await getTopRatedGames({
      dependencies: { gameService },
      payload: { pagination },
    });

    expect(result.data).toHaveLength(2);
    expect(gameService.getTopRatedGames).toHaveBeenCalledWith(pagination);
  });

  it("should return empty data array when no games are found", async () => {
    gameService.getTopRatedGames.mockResolvedValue({
      data: [],
      pagination: {
        total: 0,
        limit: 10,
        offset: 0,
        hasMore: false,
      },
    });

    const result = await getTopRatedGames({
      dependencies: { gameService },
      payload: {},
    });

    expect(result.data).toHaveLength(0);
    expect(gameService.getTopRatedGames).toHaveBeenCalledWith(undefined);
  });

  it("should throw error when service fails", async () => {
    const error = new Error("Service error");
    gameService.getTopRatedGames.mockRejectedValue(error);

    await expect(
      getTopRatedGames({
        dependencies: { gameService },
        payload: { pagination: { limit: 3 } },
      })
    ).rejects.toThrow("Service error");
  });
});
