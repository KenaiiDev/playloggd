import { describe, it, expect, beforeEach } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";
import { type Game, createMockGame } from "@playloggd/domain";
import { GameServiceImplementation } from "./game-service-implementation";
import { IGDBApiAdapter } from "../adapters/igdb/igdb-api-adapter";

describe("GameServiceImplementation", () => {
  let gameService: GameServiceImplementation;
  const igdbAdapter = mockDeep<IGDBApiAdapter>();

  const mockGames: Game[] = [
    createMockGame({
      externalId: "1234",
      title: "The Last of Us Part I",
      description: "A post-apocalyptic action-adventure game",
      releaseDate: new Date("2022-09-02"),
      developer: "Naughty Dog",
      publisher: "Sony Interactive Entertainment",
      coverUrl: "https://images.igdb.com/cover1.jpg",
      genres: ["Action", "Adventure"],
      platforms: ["PS5", "PC"],
      rating: 95,
      createdAt: new Date("2022-01-01"),
      updatedAt: new Date("2022-09-02"),
    }),
    createMockGame({
      externalId: "5678",
      title: "God of War Ragnarök",
      description: "Action-adventure game based on Norse mythology",
      releaseDate: new Date("2022-11-09"),
      developer: "Santa Monica Studio",
      publisher: "Sony Interactive Entertainment",
      coverUrl: "https://images.igdb.com/cover2.jpg",
      genres: ["Action", "RPG"],
      platforms: ["PS5", "PS4"],
      rating: 94,
      createdAt: new Date("2022-03-15"),
      updatedAt: new Date("2022-11-09"),
    }),
    createMockGame({
      externalId: "9012",
      title: "Elden Ring",
      description: "An action RPG in a dark fantasy setting",
      releaseDate: new Date("2022-02-25"),
      developer: "FromSoftware",
      publisher: "Bandai Namco",
      coverUrl: "https://images.igdb.com/cover3.jpg",
      genres: ["Action", "RPG"],
      platforms: ["PS5", "PS4", "Xbox Series X/S", "PC"],
      rating: 96,
      createdAt: new Date("2021-06-10"),
      updatedAt: new Date("2022-02-25"),
    }),
  ];

  beforeEach(() => {
    mockReset(igdbAdapter);
    gameService = new GameServiceImplementation(igdbAdapter);
  });

  describe("searchGames", () => {
    it("should return games matching the search query", async () => {
      const query = "Last of Us";
      const mockResponse = {
        data: [mockGames[0]],
        pagination: {
          total: 1,
          limit: 10,
          offset: 0,
          hasMore: false,
        },
      };
      igdbAdapter.searchGames.mockResolvedValue(mockResponse);

      const result = await gameService.searchGames(query);

      expect(result.data).toHaveLength(1);
      expect(result.data[0].title).toBe("The Last of Us Part I");
      expect(igdbAdapter.searchGames).toHaveBeenCalledWith(query, undefined);
    });

    it("should return empty array when no games match the query", async () => {
      const query = "Nonexistent Game";
      const mockResponse = {
        data: [],
        pagination: {
          total: 0,
          limit: 10,
          offset: 0,
          hasMore: false,
        },
      };
      igdbAdapter.searchGames.mockResolvedValue(mockResponse);

      const result = await gameService.searchGames(query);

      expect(result.data).toHaveLength(0);
      expect(igdbAdapter.searchGames).toHaveBeenCalledWith(query, undefined);
    });
  });

  describe("getGameById", () => {
    it("should return a game when found by id", async () => {
      const gameId = "123";
      igdbAdapter.getGameById.mockResolvedValue(mockGames[0]);

      const result = await gameService.getGameById(gameId);

      expect(result).toBeDefined();
      expect(result?.title).toBe("The Last of Us Part I");
      expect(igdbAdapter.getGameById).toHaveBeenCalledWith(gameId);
    });

    it("should return undefined when game is not found", async () => {
      const gameId = "999";
      igdbAdapter.getGameById.mockResolvedValue(undefined);

      const result = await gameService.getGameById(gameId);

      expect(result).toBeUndefined();
      expect(igdbAdapter.getGameById).toHaveBeenCalledWith(gameId);
    });
  });

  describe("getByFilter", () => {
    it("should return games matching the filter criteria", async () => {
      const filter = {
        genres: ["Action", "Adventure"],
        platforms: ["PS5", "PC"],
        minRating: 90,
      };
      const mockResponse = {
        data: mockGames,
        pagination: {
          total: 3,
          limit: 10,
          offset: 0,
          hasMore: false,
        },
      };
      igdbAdapter.getGamesByFilter.mockResolvedValue(mockResponse);

      const result = await gameService.getByFilter(filter);

      expect(result.data).toHaveLength(3);
      expect(igdbAdapter.getGamesByFilter).toHaveBeenCalledWith(
        filter,
        undefined
      );
    });

    it("should return empty array when no games match the filter", async () => {
      const filter = { minRating: 99 };
      const mockResponse = {
        data: [],
        pagination: {
          total: 0,
          limit: 10,
          offset: 0,
          hasMore: false,
        },
      };
      igdbAdapter.getGamesByFilter.mockResolvedValue(mockResponse);

      const result = await gameService.getByFilter(filter);

      expect(result.data).toHaveLength(0);
      expect(igdbAdapter.getGamesByFilter).toHaveBeenCalledWith(
        filter,
        undefined
      );
    });
  });

  describe("getMostPopularGames", () => {
    it("should return most popular games up to the specified limit", async () => {
      const pagination = { limit: 2, offset: 0 };
      const expectedGames = mockGames.slice(0, 2);
      const mockResponse = {
        data: expectedGames,
        pagination: {
          total: 2,
          limit: 2,
          offset: 0,
          hasMore: false,
        },
      };
      igdbAdapter.getMostPopularGames.mockResolvedValue(mockResponse);

      const result = await gameService.getMostPopularGames(pagination);

      expect(result.data).toEqual(expectedGames);
      expect(igdbAdapter.getMostPopularGames).toHaveBeenCalledWith(pagination);
    });

    it("should return empty array when no games are found", async () => {
      const pagination = { limit: 5, offset: 0 };
      const mockResponse = {
        data: [],
        pagination: {
          total: 0,
          limit: 5,
          offset: 0,
          hasMore: false,
        },
      };
      igdbAdapter.getMostPopularGames.mockResolvedValue(mockResponse);

      const result = await gameService.getMostPopularGames(pagination);

      expect(result.data).toEqual([]);
      expect(igdbAdapter.getMostPopularGames).toHaveBeenCalledWith(pagination);
    });

    it("should throw error when adapter fails", async () => {
      const pagination = { limit: 2, offset: 0 };
      const error = new Error("API Error");
      igdbAdapter.getMostPopularGames.mockRejectedValue(error);

      await expect(gameService.getMostPopularGames(pagination)).rejects.toThrow(
        "API Error"
      );
    });
  });

  describe("getTopRatedGames", () => {
    it("should return top rated games sorted by rating", async () => {
      const pagination = { limit: 2, offset: 0 };
      const sortedGames = [...mockGames].sort((a, b) => b.rating - a.rating);
      const expectedGames = sortedGames.slice(0, 2);
      const mockResponse = {
        data: expectedGames,
        pagination: {
          total: 2,
          limit: 2,
          offset: 0,
          hasMore: false,
        },
      };
      igdbAdapter.getTopRatedGames.mockResolvedValue(mockResponse);

      const result = await gameService.getTopRatedGames(pagination);

      expect(result.data).toEqual(expectedGames);
      expect(result.data[0].rating).toBeGreaterThanOrEqual(
        result.data[1].rating
      );
      expect(igdbAdapter.getTopRatedGames).toHaveBeenCalledWith(pagination);
    });

    it("should return empty array when no games are found", async () => {
      const pagination = { limit: 5, offset: 0 };
      const mockResponse = {
        data: [],
        pagination: {
          total: 0,
          limit: 5,
          offset: 0,
          hasMore: false,
        },
      };
      igdbAdapter.getTopRatedGames.mockResolvedValue(mockResponse);

      const result = await gameService.getTopRatedGames(pagination);

      expect(result.data).toEqual([]);
      expect(igdbAdapter.getTopRatedGames).toHaveBeenCalledWith(pagination);
    });

    it("should throw error when adapter fails", async () => {
      const pagination = { limit: 2, offset: 0 };
      const error = new Error("API Error");
      igdbAdapter.getTopRatedGames.mockRejectedValue(error);

      await expect(gameService.getTopRatedGames(pagination)).rejects.toThrow(
        "API Error"
      );
    });
  });

  describe("getUpcomingGames", () => {
    const futureMockGames = [
      createMockGame({
        externalId: "9999",
        title: "Final Fantasy XVI-2",
        description: "The next chapter in the FF series",
        releaseDate: new Date("2026-01-15"),
        developer: "Square Enix",
        publisher: "Square Enix",
        coverUrl: "https://images.igdb.com/cover-ff.jpg",
        genres: ["RPG", "Action"],
        platforms: ["PS5"],
        rating: 0,
        createdAt: new Date("2025-01-15"),
        updatedAt: new Date("2025-01-15"),
      }),
      createMockGame({
        externalId: "8888",
        title: "GTA VI",
        description: "The next Grand Theft Auto game",
        releaseDate: new Date("2026-03-20"),
        developer: "Rockstar Games",
        publisher: "Take-Two Interactive",
        coverUrl: "https://images.igdb.com/cover-gta.jpg",
        genres: ["Action", "Adventure"],
        platforms: ["PS5", "Xbox Series X/S"],
        rating: 0,
        createdAt: new Date("2025-03-20"),
        updatedAt: new Date("2025-03-20"),
      }),
    ];

    it("should return upcoming games sorted by release date", async () => {
      const pagination = { limit: 2, offset: 0 };
      const mockResponse = {
        data: futureMockGames,
        pagination: {
          total: 2,
          limit: 2,
          offset: 0,
          hasMore: false,
        },
      };
      igdbAdapter.getUpcomingGames.mockResolvedValue(mockResponse);

      const result = await gameService.getUpcomingGames(pagination);

      expect(result.data).toEqual(futureMockGames);
      expect(result.data[0].releaseDate).toBeDefined();
      expect(result.data[0].releaseDate! < result.data[1].releaseDate!).toBe(
        true
      );
      expect(igdbAdapter.getUpcomingGames).toHaveBeenCalledWith(pagination);
    });

    it("should return empty array when no upcoming games are found", async () => {
      const pagination = { limit: 5, offset: 0 };
      const mockResponse = {
        data: [],
        pagination: {
          total: 0,
          limit: 5,
          offset: 0,
          hasMore: false,
        },
      };
      igdbAdapter.getUpcomingGames.mockResolvedValue(mockResponse);

      const result = await gameService.getUpcomingGames(pagination);

      expect(result.data).toEqual([]);
      expect(igdbAdapter.getUpcomingGames).toHaveBeenCalledWith(pagination);
    });

    it("should throw error when adapter fails", async () => {
      const pagination = { limit: 2, offset: 0 };
      const error = new Error("API Error");
      igdbAdapter.getUpcomingGames.mockRejectedValue(error);

      await expect(gameService.getUpcomingGames(pagination)).rejects.toThrow(
        "API Error"
      );
    });
  });

  describe("getRecentReleaseGames", () => {
    const recentMockGames = [
      createMockGame({
        externalId: "7777",
        title: "Recent Game 1",
        description: "A recently released game",
        releaseDate: new Date("2025-11-01"),
        developer: "Developer A",
        publisher: "Publisher A",
        coverUrl: "https://images.igdb.com/cover-recent1.jpg",
        genres: ["Action"],
        platforms: ["PS5", "PC"],
        rating: 88,
        createdAt: new Date("2025-11-01"),
        updatedAt: new Date("2025-11-01"),
      }),
      createMockGame({
        externalId: "6666",
        title: "Recent Game 2",
        description: "Another recent release",
        releaseDate: new Date("2025-10-25"),
        developer: "Developer B",
        publisher: "Publisher B",
        coverUrl: "https://images.igdb.com/cover-recent2.jpg",
        genres: ["RPG"],
        platforms: ["PS5", "Xbox Series X/S"],
        rating: 85,
        createdAt: new Date("2025-10-25"),
        updatedAt: new Date("2025-10-25"),
      }),
    ];

    it("should return recent release games sorted by release date", async () => {
      const pagination = { limit: 2, offset: 0 };
      const mockResponse = {
        data: recentMockGames,
        pagination: {
          total: 2,
          limit: 2,
          offset: 0,
          hasMore: false,
        },
      };
      igdbAdapter.getRecentReleaseGames.mockResolvedValue(mockResponse);

      const result = await gameService.getRecentReleaseGames(pagination);

      expect(result.data).toEqual(recentMockGames);
      expect(result.data[0].releaseDate).toBeDefined();
      expect(result.data[0].releaseDate! > result.data[1].releaseDate!).toBe(
        true
      );
      expect(igdbAdapter.getRecentReleaseGames).toHaveBeenCalledWith(
        pagination
      );
    });

    it("should return empty array when no recent games are found", async () => {
      const pagination = { limit: 5, offset: 0 };
      const mockResponse = {
        data: [],
        pagination: {
          total: 0,
          limit: 5,
          offset: 0,
          hasMore: false,
        },
      };
      igdbAdapter.getRecentReleaseGames.mockResolvedValue(mockResponse);

      const result = await gameService.getRecentReleaseGames(pagination);

      expect(result.data).toEqual([]);
      expect(igdbAdapter.getRecentReleaseGames).toHaveBeenCalledWith(
        pagination
      );
    });

    it("should throw error when adapter fails", async () => {
      const pagination = { limit: 2, offset: 0 };
      const error = new Error("API Error");
      igdbAdapter.getRecentReleaseGames.mockRejectedValue(error);

      await expect(
        gameService.getRecentReleaseGames(pagination)
      ).rejects.toThrow("API Error");
    });
  });
});
