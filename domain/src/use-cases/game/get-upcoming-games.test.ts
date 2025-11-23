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
    createMockGame({ title: "Final Fantasy XVI-2", releaseDate: futureDate1 }),
    createMockGame({ title: "GTA VI", releaseDate: futureDate2 }),
    createMockGame({ title: "Elder Scrolls VI", releaseDate: futureDate3 }),
  ];

  const gameService = createGameServiceMock();

  beforeEach(() => {
    mockReset(gameService);
  });

  it("should return paginated upcoming games when request is successful", async () => {
    gameService.getUpcomingGames.mockResolvedValue({
      data: mockGames,
      pagination: {
        total: 3,
        limit: 10,
        offset: 0,
        hasMore: false,
      },
    });

    const result = await getUpcomingGames({
      dependencies: { gameService },
      payload: { pagination: { limit: 3 } },
    });

    expect(result.data).toHaveLength(3);
    expect(gameService.getUpcomingGames).toHaveBeenCalledWith({ limit: 3 });
    expect(result.data).toEqual(mockGames);
  });

  it("should pass pagination parameters to service", async () => {
    const pagination = { limit: 5, offset: 10 };

    gameService.getUpcomingGames.mockResolvedValue({
      data: mockGames.slice(0, 2),
      pagination: {
        total: 12,
        limit: 5,
        offset: 10,
        hasMore: false,
      },
    });

    const result = await getUpcomingGames({
      dependencies: { gameService },
      payload: { pagination },
    });

    expect(result.data).toHaveLength(2);
    expect(gameService.getUpcomingGames).toHaveBeenCalledWith(pagination);
  });

  it("should return empty data array when no upcoming games are found", async () => {
    gameService.getUpcomingGames.mockResolvedValue({
      data: [],
      pagination: {
        total: 0,
        limit: 10,
        offset: 0,
        hasMore: false,
      },
    });

    const result = await getUpcomingGames({
      dependencies: { gameService },
      payload: {},
    });

    expect(result.data).toHaveLength(0);
    expect(gameService.getUpcomingGames).toHaveBeenCalledWith(undefined);
  });

  it("should throw error when service fails", async () => {
    const error = new Error("Service error");
    gameService.getUpcomingGames.mockRejectedValue(error);

    await expect(
      getUpcomingGames({
        dependencies: { gameService },
        payload: { pagination: { limit: 3 } },
      })
    ).rejects.toThrow("Service error");
  });
});
