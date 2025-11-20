import { describe, it, expect, beforeEach, vi } from "vitest";
import { PrismaClient } from "@prisma/client";

import { createMockGameReview } from "@playloggd/domain";
import { GameReviewServiceImplementation } from "./game-review-service-implementation";

vi.mock("@prisma/client", () => {
  const mockPrisma = {
    gameReview: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  };
  return { PrismaClient: vi.fn(() => mockPrisma) };
});

describe("GameReviewServiceImplementation", () => {
  let prisma: PrismaClient;
  let gameReviewService: GameReviewServiceImplementation;

  const mockPrisma = {
    gameReview: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  };

  beforeEach(() => {
    prisma = mockPrisma as unknown as PrismaClient;
    gameReviewService = new GameReviewServiceImplementation(prisma);
    vi.clearAllMocks();
  });

  describe("getUserGameReview", () => {
    it("Should return a review of a specific game and a specific user", async () => {
      const mockGameReview = createMockGameReview({
        userId: "user1",
        gameExternalId: "game1",
        hoursPlayed: 2,
      });

      const mockReturnedReview = {
        ...mockGameReview,
        id: "review1",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.gameReview.findUnique.mockResolvedValue(mockReturnedReview);

      const result = await gameReviewService.getUserGameReview(
        "user1",
        "game1"
      );

      expect(result).toStrictEqual(mockReturnedReview);
      expect(mockPrisma.gameReview.findUnique).toHaveBeenCalledWith({
        where: {
          userId_gameExternalId: {
            userId: "user1",
            gameExternalId: "game1",
          },
        },
      });
    });

    it("should return undefined when review is not found", async () => {
      mockPrisma.gameReview.findUnique.mockResolvedValue(null);

      const result = await gameReviewService.getUserGameReview(
        "user1",
        "game1"
      );

      expect(result).toBeUndefined();
      expect(mockPrisma.gameReview.findUnique).toHaveBeenCalledWith({
        where: {
          userId_gameExternalId: {
            userId: "user1",
            gameExternalId: "game1",
          },
        },
      });
    });

    it("should handle null hoursPlayed and playedAt fields", async () => {
      const mockReturnedReview = {
        id: "review1",
        userId: "user1",
        gameExternalId: "game1",
        rating: 9.5,
        content: "Great game",
        hoursPlayed: null,
        playedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.gameReview.findUnique.mockResolvedValue(mockReturnedReview);

      const result = await gameReviewService.getUserGameReview(
        "user1",
        "game1"
      );

      expect(result).toEqual({
        ...mockReturnedReview,
        hoursPlayed: undefined,
        playedAt: undefined,
      });
    });
  });

  describe("create", () => {
    it("should create a new game review", async () => {
      const newReview = {
        userId: "user1",
        gameExternalId: "game1",
        rating: 9.0,
        content: "Amazing game!",
        hoursPlayed: 50,
        playedAt: new Date(),
      };

      const mockCreatedReview = {
        ...newReview,
        id: "review1",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.gameReview.create.mockResolvedValue(mockCreatedReview);

      const result = await gameReviewService.create(newReview);

      expect(result).toStrictEqual(mockCreatedReview);
      expect(mockPrisma.gameReview.create).toHaveBeenCalledWith({
        data: newReview,
      });
    });

    it("should create a review without optional fields", async () => {
      const newReview = {
        userId: "user1",
        gameExternalId: "game1",
        rating: 8.5,
        content: "Good game",
      };

      const mockCreatedReview = {
        ...newReview,
        id: "review1",
        hoursPlayed: undefined,
        playedAt: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.gameReview.create.mockResolvedValue(mockCreatedReview);

      const result = await gameReviewService.create(newReview);

      expect(mockPrisma.gameReview.create).toHaveBeenCalledWith({
        data: newReview,
      });
      expect(result).toStrictEqual(mockCreatedReview);
    });
  });

  describe("getById", () => {
    it("should return a review when found by id", async () => {
      const mockReview = createMockGameReview({
        userId: "user1",
        gameExternalId: "game1",
      });

      const mockReturnedReview = {
        ...mockReview,
        id: "review1",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.gameReview.findUnique.mockResolvedValue(mockReturnedReview);

      const result = await gameReviewService.getById("review1");

      expect(result).toStrictEqual(mockReturnedReview);
      expect(mockPrisma.gameReview.findUnique).toHaveBeenCalledWith({
        where: { id: "review1" },
      });
    });

    it("should return undefined when review is not found by id", async () => {
      mockPrisma.gameReview.findUnique.mockResolvedValue(null);

      const result = await gameReviewService.getById("nonexistent");

      expect(result).toBeUndefined();
      expect(mockPrisma.gameReview.findUnique).toHaveBeenCalledWith({
        where: { id: "nonexistent" },
      });
    });
  });

  describe("update", () => {
    it("should update a game review", async () => {
      const updateData = {
        rating: 9.5,
        content: "Updated review content",
        hoursPlayed: 100,
      };

      const mockUpdatedReview = {
        id: "review1",
        userId: "user1",
        gameExternalId: "game1",
        ...updateData,
        playedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.gameReview.update.mockResolvedValue(mockUpdatedReview);

      const result = await gameReviewService.update({
        id: "review1",
        data: updateData,
      });

      expect(result).toStrictEqual(mockUpdatedReview);
      expect(mockPrisma.gameReview.update).toHaveBeenCalledWith({
        where: { id: "review1" },
        data: updateData,
      });
    });

    it("should update only provided fields", async () => {
      const updateData = {
        rating: 7.5,
      };

      const mockUpdatedReview = {
        id: "review1",
        userId: "user1",
        gameExternalId: "game1",
        rating: 7.5,
        content: "Original content",
        hoursPlayed: 50,
        playedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.gameReview.update.mockResolvedValue(mockUpdatedReview);

      const result = await gameReviewService.update({
        id: "review1",
        data: updateData,
      });

      expect(mockPrisma.gameReview.update).toHaveBeenCalledWith({
        where: { id: "review1" },
        data: updateData,
      });
      expect(result).toStrictEqual(mockUpdatedReview);
    });
  });

  describe("delete", () => {
    it("should delete a game review", async () => {
      const mockDeletedReview = {
        id: "review1",
        userId: "user1",
        gameExternalId: "game1",
        rating: 9.0,
        content: "Great game",
        hoursPlayed: 50,
        playedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.gameReview.delete.mockResolvedValue(mockDeletedReview);

      await gameReviewService.delete("review1");

      expect(mockPrisma.gameReview.delete).toHaveBeenCalledWith({
        where: { id: "review1" },
      });
    });
  });

  describe("getGameReviews", () => {
    it("should return all reviews for a specific game", async () => {
      const mockReviews = [
        createMockGameReview({
          userId: "user1",
          gameExternalId: "game1",
          rating: 9.0,
        }),
        createMockGameReview({
          userId: "user2",
          gameExternalId: "game1",
          rating: 8.5,
        }),
      ];

      const mockReturnedReviews = mockReviews.map((review, index) => ({
        ...review,
        id: `review${index + 1}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      mockPrisma.gameReview.findMany.mockResolvedValue(mockReturnedReviews);

      const result = await gameReviewService.getGameReviews("game1");

      expect(result).toStrictEqual(mockReturnedReviews);
      expect(mockPrisma.gameReview.findMany).toHaveBeenCalledWith({
        where: { gameExternalId: "game1" },
      });
    });

    it("should return empty array when no reviews found for game", async () => {
      mockPrisma.gameReview.findMany.mockResolvedValue([]);

      const result = await gameReviewService.getGameReviews("game1");

      expect(result).toEqual([]);
      expect(mockPrisma.gameReview.findMany).toHaveBeenCalledWith({
        where: { gameExternalId: "game1" },
      });
    });
  });

  describe("getUserReviews", () => {
    it("should return all reviews by a specific user", async () => {
      const mockReviews = [
        createMockGameReview({
          userId: "user1",
          gameExternalId: "game1",
          rating: 9.0,
        }),
        createMockGameReview({
          userId: "user1",
          gameExternalId: "game2",
          rating: 7.5,
        }),
      ];

      const mockReturnedReviews = mockReviews.map((review, index) => ({
        ...review,
        id: `review${index + 1}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      mockPrisma.gameReview.findMany.mockResolvedValue(mockReturnedReviews);

      const result = await gameReviewService.getUserReviews("user1");

      expect(result).toStrictEqual(mockReturnedReviews);
      expect(mockPrisma.gameReview.findMany).toHaveBeenCalledWith({
        where: { userId: "user1" },
      });
    });

    it("should return empty array when user has no reviews", async () => {
      mockPrisma.gameReview.findMany.mockResolvedValue([]);

      const result = await gameReviewService.getUserReviews("user1");

      expect(result).toEqual([]);
      expect(mockPrisma.gameReview.findMany).toHaveBeenCalledWith({
        where: { userId: "user1" },
      });
    });
  });
});
