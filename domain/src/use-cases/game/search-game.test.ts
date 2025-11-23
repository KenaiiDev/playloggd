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

  it("should return paginated games when search is successful", async () => {
    const query = "Last of Us";
    gameService.searchGames.mockResolvedValue({
      data: mockGames.slice(0, 2),
      pagination: {
        total: 2,
        limit: 10,
        offset: 0,
        hasMore: false,
      },
    });

    const result = await searchGame({
      dependencies: { gameService },
      payload: { query },
    });

    expect(result.data).toHaveLength(2);
    expect(result.pagination.total).toBe(2);
    expect(gameService.searchGames).toHaveBeenCalledWith(query, undefined);
    expect(result.data[0].title).toContain("Last of Us");
  });

  it("should pass pagination parameters to service", async () => {
    const query = "God of War";
    const pagination = { limit: 5, offset: 10 };

    gameService.searchGames.mockResolvedValue({
      data: [mockGames[2]],
      pagination: {
        total: 11,
        limit: 5,
        offset: 10,
        hasMore: false,
      },
    });

    const result = await searchGame({
      dependencies: { gameService },
      payload: { query, pagination },
    });

    expect(result.data).toHaveLength(1);
    expect(gameService.searchGames).toHaveBeenCalledWith(query, pagination);
  });

  it("should return empty data array when no games are found", async () => {
    const query = "Non existent game";
    gameService.searchGames.mockResolvedValue({
      data: [],
      pagination: {
        total: 0,
        limit: 10,
        offset: 0,
        hasMore: false,
      },
    });

    const result = await searchGame({
      dependencies: { gameService },
      payload: { query },
    });

    expect(result.data).toHaveLength(0);
    expect(gameService.searchGames).toHaveBeenCalledWith(query, undefined);
  });

  it("should throw error when query is empty", async () => {
    const query = "";

    await expect(
      searchGame({
        dependencies: { gameService },
        payload: { query },
      })
    ).rejects.toThrow(Error);
  });

  it("should throw error when query is too short", async () => {
    const query = "a"; // Too short

    await expect(
      searchGame({
        dependencies: { gameService },
        payload: { query },
      })
    ).rejects.toThrow(Error);
    expect(gameService.searchGames).not.toHaveBeenCalled();
  });
});
