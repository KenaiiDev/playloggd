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
    createMockGame({
      title: "Spider-Man 3",
      releaseDate: recentDate1,
    }),
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

  it("should return recent release games when request is successful", async () => {
    gameService.getRecentReleaseGames.mockResolvedValue(mockGames);

    const result = await getRecentReleaseGames({
      dependencies: { gameService },
      payload: { limit: 3 },
    });

    if (!Array.isArray(result)) {
      throw new Error("Expected result to be an array of games");
    }

    expect(result).toHaveLength(3);
    expect(gameService.getRecentReleaseGames).toHaveBeenCalledWith(3);
    expect(result).toEqual(mockGames);
    expect(result[0].releaseDate).toBeInstanceOf(Date);
    expect(result[0].releaseDate! >= result[1].releaseDate!).toBe(true);
    expect(result[1].releaseDate! >= result[2].releaseDate!).toBe(true);
  });

  it("should return empty array when no recent games are found", async () => {
    gameService.getRecentReleaseGames.mockResolvedValue([]);

    const result = await getRecentReleaseGames({
      dependencies: { gameService },
      payload: { limit: 3 },
    });

    expect(result).toHaveLength(0);
    expect(gameService.getRecentReleaseGames).toHaveBeenCalledWith(3);
  });

  it("should use default limit when no limit is provided", async () => {
    gameService.getRecentReleaseGames.mockResolvedValue(mockGames.slice(0, 2));

    const result = await getRecentReleaseGames({
      dependencies: { gameService },
      payload: {},
    });

    expect(result).toHaveLength(2);
    expect(gameService.getRecentReleaseGames).toHaveBeenCalledWith(10);
  });

  it("should throw error when service fails", async () => {
    const error = new Error("Service error");
    gameService.getRecentReleaseGames.mockRejectedValue(error);

    await expect(
      getRecentReleaseGames({
        dependencies: { gameService },
        payload: { limit: 3 },
      })
    ).rejects.toThrow("Service error");
  });
});
