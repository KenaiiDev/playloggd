import { beforeEach, describe, expect, it } from "vitest";
import { mockReset } from "vitest-mock-extended";

import { createMockGame } from "@/entities/__mocks__/mock-game";
import { createGameServiceMock } from "@/services/__mocks__/";
import { getUpcomingGames } from "./get-upcoming-games";

describe("Get Upcoming Games Use Case", () => {
  const futureDate1 = new Date("2026-01-15");
  const futureDate2 = new Date("2026-03-20");
  const futureDate3 = new Date("2026-06-30");

  const mockGames = [
    createMockGame({
      title: "Final Fantasy XVI-2",
      releaseDate: futureDate1,
    }),
    createMockGame({
      title: "GTA VI",
      releaseDate: futureDate2,
    }),
    createMockGame({
      title: "Elder Scrolls VI",
      releaseDate: futureDate3,
    }),
  ];

  const gameService = createGameServiceMock();

  beforeEach(() => {
    mockReset(gameService);
  });

  it("should return upcoming games when request is successful", async () => {
    gameService.getUpcomingGames.mockResolvedValue(mockGames);

    const result = await getUpcomingGames({
      dependencies: { gameService },
      payload: { limit: 3 },
    });

    if (!Array.isArray(result)) {
      throw new Error("Expected result to be an array of games");
    }

    expect(result).toHaveLength(3);
    expect(gameService.getUpcomingGames).toHaveBeenCalledWith(3);
    expect(result).toEqual(mockGames);
  });

  it("should return empty array when no upcoming games are found", async () => {
    gameService.getUpcomingGames.mockResolvedValue([]);

    const result = await getUpcomingGames({
      dependencies: { gameService },
      payload: { limit: 3 },
    });

    expect(result).toHaveLength(0);
    expect(gameService.getUpcomingGames).toHaveBeenCalledWith(3);
  });

  it("should use default limit when no limit is provided", async () => {
    gameService.getUpcomingGames.mockResolvedValue(mockGames.slice(0, 2));

    const result = await getUpcomingGames({
      dependencies: { gameService },
      payload: {},
    });

    expect(result).toHaveLength(2);
    expect(gameService.getUpcomingGames).toHaveBeenCalledWith(10);
  });

  it("should throw error when service fails", async () => {
    const error = new Error("Service error");
    gameService.getUpcomingGames.mockRejectedValue(error);

    await expect(
      getUpcomingGames({
        dependencies: { gameService },
        payload: { limit: 3 },
      })
    ).rejects.toThrow("Service error");
  });
});
