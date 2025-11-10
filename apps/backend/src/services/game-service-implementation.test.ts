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
      igdbAdapter.searchGames.mockResolvedValue([mockGames[0]]);

      const result = await gameService.searchGames(query);

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("The Last of Us Part I");
      expect(igdbAdapter.searchGames).toHaveBeenCalledWith(query);
    });

    it("should return empty array when no games match the query", async () => {
      const query = "Nonexistent Game";
      igdbAdapter.searchGames.mockResolvedValue([]);

      const result = await gameService.searchGames(query);

      expect(result).toHaveLength(0);
      expect(igdbAdapter.searchGames).toHaveBeenCalledWith(query);
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
      igdbAdapter.getGamesByFilter.mockResolvedValue(mockGames);

      const result = await gameService.getByFilter(filter);

      expect(result).toHaveLength(3);
      expect(igdbAdapter.getGamesByFilter).toHaveBeenCalledWith(filter);
    });

    it("should return empty array when no games match the filter", async () => {
      const filter = { minRating: 99 };
      igdbAdapter.getGamesByFilter.mockResolvedValue([]);

      const result = await gameService.getByFilter(filter);

      expect(result).toHaveLength(0);
      expect(igdbAdapter.getGamesByFilter).toHaveBeenCalledWith(filter);
    });
  });

  describe("getMostPopularGames", () => {
    it("should return most popular games up to the specified limit", async () => {
      const limit = 2;
      const expectedGames = mockGames.slice(0, 2);
      igdbAdapter.getMostPopularGames.mockResolvedValue(expectedGames);

      const result = await gameService.getMostPopularGames(limit);

      expect(result).toEqual(expectedGames);
      expect(igdbAdapter.getMostPopularGames).toHaveBeenCalledWith(limit);
    });

    it("should return empty array when no games are found", async () => {
      const limit = 5;
      igdbAdapter.getMostPopularGames.mockResolvedValue([]);

      const result = await gameService.getMostPopularGames(limit);

      expect(result).toEqual([]);
      expect(igdbAdapter.getMostPopularGames).toHaveBeenCalledWith(limit);
    });

    it("should throw error when adapter fails", async () => {
      const limit = 2;
      const error = new Error("API Error");
      igdbAdapter.getMostPopularGames.mockRejectedValue(error);

      await expect(gameService.getMostPopularGames(limit)).rejects.toThrow(
        "API Error"
      );
    });
  });

  describe("getTopRatedGames", () => {
    it("should return top rated games sorted by rating", async () => {
      const limit = 2;
      const sortedGames = [...mockGames].sort((a, b) => b.rating - a.rating);
      const expectedGames = sortedGames.slice(0, 2);
      igdbAdapter.getTopRatedGames.mockResolvedValue(expectedGames);

      const result = await gameService.getTopRatedGames(limit);

      expect(result).toEqual(expectedGames);
      expect(result[0].rating).toBeGreaterThanOrEqual(result[1].rating);
      expect(igdbAdapter.getTopRatedGames).toHaveBeenCalledWith(limit);
    });

    it("should return empty array when no games are found", async () => {
      const limit = 5;
      igdbAdapter.getTopRatedGames.mockResolvedValue([]);

      const result = await gameService.getTopRatedGames(limit);

      expect(result).toEqual([]);
      expect(igdbAdapter.getTopRatedGames).toHaveBeenCalledWith(limit);
    });

    it("should throw error when adapter fails", async () => {
      const limit = 2;
      const error = new Error("API Error");
      igdbAdapter.getTopRatedGames.mockRejectedValue(error);

      await expect(gameService.getTopRatedGames(limit)).rejects.toThrow(
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
      const limit = 2;
      igdbAdapter.getUpcomingGames.mockResolvedValue(futureMockGames);

      const result = await gameService.getUpcomingGames(limit);

      expect(result).toEqual(futureMockGames);
      expect(result[0].releaseDate).toBeDefined();
      expect(result[0].releaseDate! < result[1].releaseDate!).toBe(true);
      expect(igdbAdapter.getUpcomingGames).toHaveBeenCalledWith(limit);
    });

    it("should return empty array when no upcoming games are found", async () => {
      const limit = 5;
      igdbAdapter.getUpcomingGames.mockResolvedValue([]);

      const result = await gameService.getUpcomingGames(limit);

      expect(result).toEqual([]);
      expect(igdbAdapter.getUpcomingGames).toHaveBeenCalledWith(limit);
    });

    it("should throw error when adapter fails", async () => {
      const limit = 2;
      const error = new Error("API Error");
      igdbAdapter.getUpcomingGames.mockRejectedValue(error);

      await expect(gameService.getUpcomingGames(limit)).rejects.toThrow(
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
      const limit = 2;
      igdbAdapter.getRecentReleaseGames.mockResolvedValue(recentMockGames);

      const result = await gameService.getRecentReleaseGames(limit);

      expect(result).toEqual(recentMockGames);
      expect(result[0].releaseDate).toBeDefined();
      expect(result[0].releaseDate! > result[1].releaseDate!).toBe(true);
      expect(igdbAdapter.getRecentReleaseGames).toHaveBeenCalledWith(limit);
    });

    it("should return empty array when no recent games are found", async () => {
      const limit = 5;
      igdbAdapter.getRecentReleaseGames.mockResolvedValue([]);

      const result = await gameService.getRecentReleaseGames(limit);

      expect(result).toEqual([]);
      expect(igdbAdapter.getRecentReleaseGames).toHaveBeenCalledWith(limit);
    });

    it("should throw error when adapter fails", async () => {
      const limit = 2;
      const error = new Error("API Error");
      igdbAdapter.getRecentReleaseGames.mockRejectedValue(error);

      await expect(gameService.getRecentReleaseGames(limit)).rejects.toThrow(
        "API Error"
      );
    });
  });
});
