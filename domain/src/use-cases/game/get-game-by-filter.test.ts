import { beforeEach, describe, expect, it } from "vitest";
import { mockReset } from "vitest-mock-extended";

import { createMockGame } from "@/entities/__mocks__/mock-game";
import { createGameServiceMock } from "@/services/__mocks__/";
import { getGameByFilter } from "./get-game-by-filter";

describe("Get Game By Filter Use Case", () => {
  const mockGames = [
    createMockGame({
      title: "The Last of Us",
      developer: "Naughty Dog",
      publisher: "Sony",
      genres: ["Action", "Adventure"],
      platforms: ["PS5"],
      releaseDate: new Date("2023-01-01"),
      rating: 4.5,
    }),
    createMockGame({
      title: "God of War",
      developer: "Santa Monica",
      publisher: "Sony",
      genres: ["Action", "RPG"],
      platforms: ["PS5"],
      releaseDate: new Date("2023-06-01"),
      rating: 4.8,
    }),
  ];

  const gameService = createGameServiceMock();

  beforeEach(() => {
    mockReset(gameService);
  });

  it("should return filtered games by title", async () => {
    const filter = { title: "Last" };
    gameService.getByFilter.mockResolvedValue({
      data: [mockGames[0]],
      pagination: {
        total: 1,
        limit: 10,
        offset: 0,
        hasMore: false,
      },
    });

    const result = await getGameByFilter({
      dependencies: { gameService },
      payload: { filter },
    });

    expect(result.data).toHaveLength(1);
    expect(result.data[0].title).toBe("The Last of Us");
    expect(gameService.getByFilter).toHaveBeenCalledWith(filter, undefined);
  });

  it("should return filtered games by developer", async () => {
    const filter = { developer: "Santa Monica" };
    gameService.getByFilter.mockResolvedValue({
      data: [mockGames[1]],
      pagination: {
        total: 1,
        limit: 10,
        offset: 0,
        hasMore: false,
      },
    });

    const result = await getGameByFilter({
      dependencies: { gameService },
      payload: { filter },
    });

    expect(result.data).toHaveLength(1);
    expect(result.data[0].developer).toBe("Santa Monica");
    expect(gameService.getByFilter).toHaveBeenCalledWith(filter, undefined);
  });

  it("should return filtered games by genre", async () => {
    const filter = { genres: ["RPG"] };
    gameService.getByFilter.mockResolvedValue({
      data: [mockGames[1]],
      pagination: {
        total: 1,
        limit: 10,
        offset: 0,
        hasMore: false,
      },
    });

    const result = await getGameByFilter({
      dependencies: { gameService },
      payload: { filter },
    });

    expect(result.data).toHaveLength(1);
    expect(result.data[0].genres).toContain("RPG");
    expect(gameService.getByFilter).toHaveBeenCalledWith(filter, undefined);
  });

  it("should return filtered games by platform", async () => {
    const filter = { platforms: ["PS5"] };
    gameService.getByFilter.mockResolvedValue({
      data: mockGames,
      pagination: {
        total: 2,
        limit: 10,
        offset: 0,
        hasMore: false,
      },
    });

    const result = await getGameByFilter({
      dependencies: { gameService },
      payload: { filter },
    });

    expect(result.data).toHaveLength(2);
    expect(gameService.getByFilter).toHaveBeenCalledWith(filter, undefined);
  });

  it("should return filtered games by publisher", async () => {
    const filter = { publisher: "Sony" };
    gameService.getByFilter.mockResolvedValue({
      data: mockGames,
      pagination: {
        total: 2,
        limit: 10,
        offset: 0,
        hasMore: false,
      },
    });

    const result = await getGameByFilter({
      dependencies: { gameService },
      payload: { filter },
    });

    expect(result.data).toHaveLength(2);
    expect(gameService.getByFilter).toHaveBeenCalledWith(filter, undefined);
  });

  it("should return filtered games by date range", async () => {
    const filter = {
      fromDate: new Date("2023-01-01"),
      toDate: new Date("2023-03-01"),
    };
    gameService.getByFilter.mockResolvedValue({
      data: [mockGames[0]],
      pagination: {
        total: 1,
        limit: 10,
        offset: 0,
        hasMore: false,
      },
    });

    const result = await getGameByFilter({
      dependencies: { gameService },
      payload: { filter },
    });

    expect(result.data).toHaveLength(1);
    expect(gameService.getByFilter).toHaveBeenCalledWith(filter, undefined);
  });

  it("should return filtered games by minimum rating", async () => {
    const filter = { minRating: 4.7 };
    gameService.getByFilter.mockResolvedValue({
      data: [mockGames[1]],
      pagination: {
        total: 1,
        limit: 10,
        offset: 0,
        hasMore: false,
      },
    });

    const result = await getGameByFilter({
      dependencies: { gameService },
      payload: { filter },
    });

    expect(result.data).toHaveLength(1);
    expect(result.data[0].rating).toBeGreaterThan(4.7);
    expect(gameService.getByFilter).toHaveBeenCalledWith(filter, undefined);
  });

  it("should pass pagination parameters to service", async () => {
    const filter = { title: "Last" };
    const pagination = { limit: 5, offset: 10 };

    gameService.getByFilter.mockResolvedValue({
      data: [mockGames[0]],
      pagination: {
        total: 15,
        limit: 5,
        offset: 10,
        hasMore: false,
      },
    });

    const result = await getGameByFilter({
      dependencies: { gameService },
      payload: { filter, pagination },
    });

    expect(result.data).toHaveLength(1);
    expect(gameService.getByFilter).toHaveBeenCalledWith(filter, pagination);
  });

  it("should return empty array when no games match filters", async () => {
    const filter = { title: "Non existent game" };
    gameService.getByFilter.mockResolvedValue({
      data: [],
      pagination: {
        total: 0,
        limit: 10,
        offset: 0,
        hasMore: false,
      },
    });

    const result = await getGameByFilter({
      dependencies: { gameService },
      payload: { filter },
    });

    expect(result.data).toHaveLength(0);
    expect(gameService.getByFilter).toHaveBeenCalledWith(filter, undefined);
  });

  it("should return all games when no filters are provided", async () => {
    const filter = {};
    gameService.getByFilter.mockResolvedValue({
      data: mockGames,
      pagination: {
        total: 2,
        limit: 10,
        offset: 0,
        hasMore: false,
      },
    });

    const result = await getGameByFilter({
      dependencies: { gameService },
      payload: { filter },
    });

    expect(result.data).toHaveLength(2);
    expect(gameService.getByFilter).toHaveBeenCalledWith(filter, undefined);
  });
});
