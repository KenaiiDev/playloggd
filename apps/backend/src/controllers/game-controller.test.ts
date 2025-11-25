import { createRequest, createResponse } from "node-mocks-http";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { DeepMockProxy, mockDeep } from "vitest-mock-extended";

import { GameController } from "./game-controller";
import { GameServiceImplementation } from "@/services/game-service-implementation";
import { Game, ValidationError } from "@playloggd/domain";

describe("GameController", () => {
  let gameController: GameController;
  let gameServiceMock: DeepMockProxy<GameServiceImplementation>;

  const mockGame: Game = {
    externalId: "test-1",
    title: "Test Game",
    description: "A test game",
    releaseDate: new Date("2025-01-01"),
    developer: "Test Studio",
    publisher: "Test Publisher",
    coverUrl: "https://example.com/cover.jpg",
    genres: ["Action", "RPG"],
    platforms: ["PS5", "Xbox", "PC"],
    rating: 90,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    gameServiceMock = mockDeep<GameServiceImplementation>();
    gameController = new GameController(gameServiceMock);
  });

  describe("getById", () => {
    it("should return game details successfully", async () => {
      const req = createRequest({
        method: "GET",
        url: "/games/test-1",
        params: {
          gameId: "test-1",
        },
      });
      const res = createResponse();
      res.status = vi.fn().mockReturnThis();
      res.json = vi.fn();
      const next = vi.fn();

      gameServiceMock.getGameById.mockResolvedValue(mockGame);

      await gameController.getById(req, res, next);

      expect(gameServiceMock.getGameById).toHaveBeenCalledWith("test-1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: mockGame,
        status: 200,
        statusMsg: "Success",
      });
    });

    it("should handle missing gameId", async () => {
      const req = createRequest({
        method: "GET",
        url: "/games/undefined",
        params: {},
      });
      const res = createResponse();
      const next = vi.fn();

      await gameController.getById(req, res, next);

      expect(next).toHaveBeenCalledWith(
        new ValidationError("Game id is required!")
      );
    });
  });

  describe("searchGames", () => {
    it("should return search results successfully", async () => {
      const query = "test game";
      const req = createRequest({
        method: "GET",
        url: "/games/search",
        query: { q: query },
      });
      const res = createResponse();
      res.status = vi.fn().mockReturnThis();
      res.json = vi.fn();
      const next = vi.fn();

      const searchResults = {
        data: [mockGame],
        pagination: { total: 1, limit: 10, offset: 0, hasMore: false },
      };
      gameServiceMock.searchGames.mockResolvedValue(searchResults);

      await gameController.searchGames(req, res, next);

      expect(gameServiceMock.searchGames).toHaveBeenCalledWith(query, {
        limit: NaN,
        offset: NaN,
      });
    });

    it("should validate search query length", async () => {
      const req = createRequest({
        method: "GET",
        url: "/games/search",
        query: { q: "a" },
      });
      const res = createResponse();
      const next = vi.fn();

      await gameController.searchGames(req, res, next);

      expect(next).toHaveBeenCalledWith(
        new ValidationError("Search query must be at least 2 characters long")
      );
    });

    it("should handle empty search query", async () => {
      const req = createRequest({
        method: "GET",
        url: "/games/search",
        query: { q: "" },
      });
      const res = createResponse();
      const next = vi.fn();

      await gameController.searchGames(req, res, next);

      expect(next).toHaveBeenCalledWith(
        new ValidationError("Search query cannot be empty")
      );
    });
  });

  describe("getMostPopularGames", () => {
    it("should return most popular games", async () => {
      const req = createRequest({
        method: "GET",
        url: "/games/popular",
        query: { limit: "10" },
      });
      const res = createResponse();
      res.status = vi.fn().mockReturnThis();
      res.json = vi.fn();
      const next = vi.fn();

      const popularGames = {
        data: [mockGame],
        pagination: { total: 1, limit: 10, offset: 0, hasMore: false },
      };
      gameServiceMock.getMostPopularGames.mockResolvedValue(popularGames);

      await gameController.getMostPopularGames(req, res, next);

      expect(gameServiceMock.getMostPopularGames).toHaveBeenCalledWith({
        limit: 10,
        offset: NaN,
      });
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("getTopRatedGames", () => {
    it("should return top rated games", async () => {
      const req = createRequest({
        method: "GET",
        url: "/games/top-rated",
        query: { limit: "10" },
      });
      const res = createResponse();
      res.status = vi.fn().mockReturnThis();
      res.json = vi.fn();
      const next = vi.fn();

      const topRatedGames = {
        data: [mockGame],
        pagination: { total: 1, limit: 10, offset: 0, hasMore: false },
      };
      gameServiceMock.getTopRatedGames.mockResolvedValue(topRatedGames);

      await gameController.getTopRatedGames(req, res, next);

      expect(gameServiceMock.getTopRatedGames).toHaveBeenCalledWith({
        limit: 10,
        offset: NaN,
      });
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("getUpcomingGames", () => {
    it("should return upcoming games", async () => {
      const req = createRequest({
        method: "GET",
        url: "/games/upcoming",
        query: { limit: "10" },
      });
      const res = createResponse();
      res.status = vi.fn().mockReturnThis();
      res.json = vi.fn();
      const next = vi.fn();

      const upcomingGames = {
        data: [mockGame],
        pagination: { total: 1, limit: 10, offset: 0, hasMore: false },
      };
      gameServiceMock.getUpcomingGames.mockResolvedValue(upcomingGames);

      await gameController.getUpcomingGames(req, res, next);

      expect(gameServiceMock.getUpcomingGames).toHaveBeenCalledWith({
        limit: 10,
        offset: NaN,
      });
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("getRecentReleaseGames", () => {
    it("should return recent release games", async () => {
      const req = createRequest({
        method: "GET",
        url: "/games/recent",
        query: { limit: "10" },
      });
      const res = createResponse();
      res.status = vi.fn().mockReturnThis();
      res.json = vi.fn();
      const next = vi.fn();

      const recentGames = {
        data: [mockGame],
        pagination: { total: 1, limit: 10, offset: 0, hasMore: false },
      };
      gameServiceMock.getRecentReleaseGames.mockResolvedValue(recentGames);

      await gameController.getRecentReleaseGames(req, res, next);

      expect(gameServiceMock.getRecentReleaseGames).toHaveBeenCalledWith({
        limit: 10,
        offset: NaN,
      });
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("getByFilter", () => {
    it("should return filtered games", async () => {
      const filter = { genres: ["Action"], platforms: ["PS5"] };
      const req = createRequest({
        method: "GET",
        url: "/games/filter",
        query: {
          genres: "Action",
          platforms: "PS5",
          limit: "10",
        },
      });
      const res = createResponse();
      res.status = vi.fn().mockReturnThis();
      res.json = vi.fn();
      const next = vi.fn();

      const filteredGames = {
        data: [mockGame],
        pagination: { total: 1, limit: 10, offset: 0, hasMore: false },
      };
      gameServiceMock.getByFilter.mockResolvedValue(filteredGames);

      await gameController.getByFilter(req, res, next);

      expect(gameServiceMock.getByFilter).toHaveBeenCalledWith(filter, {
        limit: 10,
        offset: NaN,
      });
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
