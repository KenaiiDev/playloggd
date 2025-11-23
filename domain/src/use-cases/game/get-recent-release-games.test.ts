import { beforeEach, describe, expect, it } from "vitest";
import { mockReset } from "vitest-mock-extended";

import { createMockGame } from "@/entities/__mocks__/mock-game";
import { createGameServiceMock } from "@/services/__mocks__/";
import { getRecentReleaseGames } from "./get-recent-release-games";

describe("Get Recent Release Games Use Case", () => {
  const recentDate1 = new Date("2025-11-01");
  const recentDate2 = new Date("2025-10-25");
  const recentDate3 = new Date("2025-10-15");

  const mockGames = [
    createMockGame({ title: "Spider-Man 3", releaseDate: recentDate1 }),
    createMockGame({
      title: "Assassin's Creed Infinity",
      releaseDate: recentDate2,
    }),
    createMockGame({
      title: "Dragon Age: Dreadwolf",
      releaseDate: recentDate3,
    }),
  ];

  const gameService = createGameServiceMock();

  beforeEach(() => {
    mockReset(gameService);
  });

  it("should return paginated recent release games when request is successful", async () => {
    gameService.getRecentReleaseGames.mockResolvedValue({
      data: mockGames,
      pagination: {
        total: 3,
        limit: 10,
        offset: 0,
        hasMore: false,
      },
    });

    const result = await getRecentReleaseGames({
      dependencies: { gameService },
      payload: { pagination: { limit: 3 } },
    });

    expect(result.data).toHaveLength(3);
    expect(gameService.getRecentReleaseGames).toHaveBeenCalledWith({
      limit: 3,
    });
    expect(result.data).toEqual(mockGames);
    expect(result.data[0].releaseDate).toBeInstanceOf(Date);
    expect(result.data[0].releaseDate! >= result.data[1].releaseDate!).toBe(
      true
    );
    expect(result.data[1].releaseDate! >= result.data[2].releaseDate!).toBe(
      true
    );
  });

  it("should pass pagination parameters to service", async () => {
    const pagination = { limit: 5, offset: 10 };

    gameService.getRecentReleaseGames.mockResolvedValue({
      data: mockGames.slice(0, 2),
      pagination: {
        total: 12,
        limit: 5,
        offset: 10,
        hasMore: false,
      },
    });

    const result = await getRecentReleaseGames({
      dependencies: { gameService },
      payload: { pagination },
    });

    expect(result.data).toHaveLength(2);
    expect(gameService.getRecentReleaseGames).toHaveBeenCalledWith(pagination);
  });

  it("should return empty data array when no recent games are found", async () => {
    gameService.getRecentReleaseGames.mockResolvedValue({
      data: [],
      pagination: {
        total: 0,
        limit: 10,
        offset: 0,
        hasMore: false,
      },
    });

    const result = await getRecentReleaseGames({
      dependencies: { gameService },
      payload: {},
    });

    expect(result.data).toHaveLength(0);
    expect(gameService.getRecentReleaseGames).toHaveBeenCalledWith(undefined);
  });

  it("should throw error when service fails", async () => {
    const error = new Error("Service error");
    gameService.getRecentReleaseGames.mockRejectedValue(error);

    await expect(
      getRecentReleaseGames({
        dependencies: { gameService },
        payload: { pagination: { limit: 3 } },
      })
    ).rejects.toThrow("Service error");
  });
});
