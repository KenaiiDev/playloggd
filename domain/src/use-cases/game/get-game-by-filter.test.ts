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
    gameService.getByFilter.mockResolvedValue([mockGames[0]]);

    const result = await getGameByFilter({
      dependencies: { gameService },
      payload: { filter },
    });

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("The Last of Us");
    expect(gameService.getByFilter).toHaveBeenCalledWith(filter);
  });

  it("should return filtered games by developer", async () => {
    const filter = { developer: "Santa Monica" };
    gameService.getByFilter.mockResolvedValue([mockGames[1]]);

    const result = await getGameByFilter({
      dependencies: { gameService },
      payload: { filter },
    });

    expect(result).toHaveLength(1);
    expect(result[0].developer).toBe("Santa Monica");
    expect(gameService.getByFilter).toHaveBeenCalledWith(filter);
  });

  it("should return filtered games by genre", async () => {
    const filter = { genres: ["RPG"] };
    gameService.getByFilter.mockResolvedValue([mockGames[1]]);

    const result = await getGameByFilter({
      dependencies: { gameService },
      payload: { filter },
    });

    expect(result).toHaveLength(1);
    expect(result[0].genres).toContain("RPG");
    expect(gameService.getByFilter).toHaveBeenCalledWith(filter);
  });

  it("should return filtered games by platform", async () => {
    const filter = { platforms: "PS5" };
    gameService.getByFilter.mockResolvedValue(mockGames);

    const result = await getGameByFilter({
      dependencies: { gameService },
      payload: { filter },
    });

    expect(result).toHaveLength(2);
    expect(gameService.getByFilter).toHaveBeenCalledWith(filter);
  });

  it("should return filtered games by publisher", async () => {
    const filter = { publisher: "Sony" };
    gameService.getByFilter.mockResolvedValue(mockGames);

    const result = await getGameByFilter({
      dependencies: { gameService },
      payload: { filter },
    });

    expect(result).toHaveLength(2);
    expect(gameService.getByFilter).toHaveBeenCalledWith(filter);
  });

  it("should return filtered games by date range", async () => {
    const filter = {
      fromDate: new Date("2023-01-01"),
      toDate: new Date("2023-03-01"),
    };
    gameService.getByFilter.mockResolvedValue([mockGames[0]]);

    const result = await getGameByFilter({
      dependencies: { gameService },
      payload: { filter },
    });

    expect(result).toHaveLength(1);
    expect(gameService.getByFilter).toHaveBeenCalledWith(filter);
  });

  it("should return filtered games by minimum rating", async () => {
    const filter = { minRating: 4.7 };
    gameService.getByFilter.mockResolvedValue([mockGames[1]]);

    const result = await getGameByFilter({
      dependencies: { gameService },
      payload: { filter },
    });

    expect(result).toHaveLength(1);
    expect(result[0].rating).toBeGreaterThan(4.7);
    expect(gameService.getByFilter).toHaveBeenCalledWith(filter);
  });

  it("should return empty array when no games match filters", async () => {
    const filter = { title: "Non existent game" };
    gameService.getByFilter.mockResolvedValue([]);

    const result = await getGameByFilter({
      dependencies: { gameService },
      payload: { filter },
    });

    expect(result).toHaveLength(0);
    expect(gameService.getByFilter).toHaveBeenCalledWith(filter);
  });

  it("should return all games when no filters are provided", async () => {
    const filter = {};
    gameService.getByFilter.mockResolvedValue(mockGames);

    const result = await getGameByFilter({
      dependencies: { gameService },
      payload: { filter },
    });

    expect(result).toHaveLength(2);
    expect(gameService.getByFilter).toHaveBeenCalledWith(filter);
  });
});
