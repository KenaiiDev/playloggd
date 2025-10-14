import { beforeEach, describe, expect, it } from "vitest";
import { mockReset } from "vitest-mock-extended";

import { createMockGame } from "@/entities/__mocks__/mock-game";
import { createGameServiceMock } from "@/services/__mocks__/";
import { searchGame } from "./search-game";

describe("Search Game Use Case", () => {
  const mockGames = [
    createMockGame({ title: "The Last of Us" }),
    createMockGame({ title: "The Last of Us Part II" }),
    createMockGame({ title: "God of War" }),
  ];

  const gameService = createGameServiceMock();

  beforeEach(() => {
    mockReset(gameService);
  });

  it("should return games when search is successful", async () => {
    const query = "Last of Us";
    gameService.searchGames.mockResolvedValue(mockGames.slice(0, 2));

    const result = await searchGame({
      dependencies: { gameService },
      payload: { query },
    });

    if (!Array.isArray(result)) {
      throw new Error("Expected result to be an array of games");
    }

    expect(result).toHaveLength(2);
    expect(gameService.searchGames).toHaveBeenCalledWith(query);
    expect(result[0].title).toContain("Last of Us");
  });

  it("should return empty array when no games are found", async () => {
    const query = "Non existent game";
    gameService.searchGames.mockResolvedValue([]);

    const result = await searchGame({
      dependencies: { gameService },
      payload: { query },
    });

    expect(result).toHaveLength(0);
    expect(gameService.searchGames).toHaveBeenCalledWith(query);
  });

  it("should return error when query is empty", async () => {
    const query = "";

    const result = await searchGame({
      dependencies: { gameService },
      payload: { query },
    });

    expect(result).toBeInstanceOf(Error);
  });

  it("should handle minimum query length requirement", async () => {
    const query = "a"; // Too short

    const result = await searchGame({
      dependencies: { gameService },
      payload: { query },
    });

    expect(result).toBeInstanceOf(Error);
    expect(gameService.searchGames).not.toHaveBeenCalled();
  });
});
