import { describe, it, expect, vi, beforeEach } from "vitest";
import { DeepMockProxy, mockDeep } from "vitest-mock-extended";
import { createRequest, createResponse } from "node-mocks-http";
import { GameReviewController } from "./game-review-controller";
import {
  GameReviewService,
  GameService,
  UserService,
  ValidationError,
} from "@playloggd/domain";

describe("GameReviewController", () => {
  let mockGameReviewService: DeepMockProxy<GameReviewService>;
  let mockGameService: DeepMockProxy<GameService>;
  let mockUserService: DeepMockProxy<UserService>;
  let controller: GameReviewController;

  beforeEach(() => {
    mockGameReviewService = mockDeep<GameReviewService>();
    mockGameService = mockDeep<GameService>();
    mockUserService = mockDeep<UserService>();
    controller = new GameReviewController(
      mockGameReviewService,
      mockGameService,
      mockUserService
    );
  });

  describe("createReview", () => {
    it("should create a new review successfully", async () => {
      const req = createRequest({
        method: "POST",
        user: { id: "user-1", username: "testuser", email: "test@example.com" },
        body: {
          gameExternalId: "game-123",
          rating: 5,
          content: "Great game!",
          hoursPlayed: 50,
          playedAt: new Date("2024-01-15"),
        },
      });

      const res = createResponse();
      res.status = vi.fn().mockReturnThis();
      res.json = vi.fn();

      const next = vi.fn();

      const mockReview = {
        id: "review-1",
        userId: "user-1",
        gameExternalId: "game-123",
        rating: 5,
        content: "Great game!",
        hoursPlayed: 50,
        playedAt: new Date("2024-01-15"),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserService.getById.mockResolvedValue({
        id: "user-1",
        username: "testuser",
        email: "test@example.com",
        passwordHash: "hashed_password",
        avatarUrl: "",
        bio: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockGameService.getGameById.mockResolvedValue({
        externalId: "game-123",
        title: "Test Game",
        description: "A test game",
        genres: ["Action"],
        rating: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockGameReviewService.getUserGameReview.mockResolvedValue(undefined);

      mockGameReviewService.create.mockResolvedValue(mockReview);

      await controller.createReview(req, res, next);

      expect(mockUserService.getById).toHaveBeenCalledWith("user-1");
      expect(mockGameService.getGameById).toHaveBeenCalledWith("game-123");
      expect(mockGameReviewService.getUserGameReview).toHaveBeenCalledWith(
        "user-1",
        "game-123"
      );
      expect(mockGameReviewService.create).toHaveBeenCalledWith({
        userId: "user-1",
        gameExternalId: "game-123",
        rating: 5,
        content: "Great game!",
        hoursPlayed: 50,
        playedAt: new Date("2024-01-15"),
      });
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("should throw error if user is not authenticated", async () => {
      const req = createRequest({
        method: "POST",
        body: {
          gameExternalId: "game-123",
          rating: 5,
          content: "Great game!",
        },
      });

      const res = createResponse();
      res.status = vi.fn().mockReturnThis();
      res.json = vi.fn();

      const next = vi.fn();

      await controller.createReview(req, res, next);

      expect(next).toHaveBeenCalledWith(
        new ValidationError("User not authenticated")
      );
    });

    it("should handle errors and call next", async () => {
      const req = createRequest({
        method: "POST",
        user: { id: "user-1", username: "testuser", email: "test@example.com" },
        body: {
          gameExternalId: "game-123",
          rating: 5,
          content: "Great game!",
        },
      });

      const res = createResponse();
      res.status = vi.fn().mockReturnThis();
      res.json = vi.fn();

      const next = vi.fn();

      mockUserService.getById.mockResolvedValue({
        id: "user-1",
        username: "testuser",
        email: "test@example.com",
        passwordHash: "hashed_password",
        avatarUrl: "",
        bio: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockGameService.getGameById.mockResolvedValue({
        externalId: "game-123",
        title: "Test Game",
        description: "A test game",
        genres: ["Action"],
        rating: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockGameReviewService.getUserGameReview.mockResolvedValue(undefined);

      const error = new Error("Database error");
      mockGameReviewService.create.mockRejectedValue(error);

      await controller.createReview(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("updateReview", () => {
    it("should update a review successfully", async () => {
      const req = createRequest({
        method: "PUT",
        user: { id: "user-1", username: "testuser", email: "test@example.com" },
        params: { reviewId: "review-1" },
        body: {
          rating: 4,
          content: "Updated review",
          hoursPlayed: 60,
        },
      });

      const res = createResponse();
      res.status = vi.fn().mockReturnThis();
      res.json = vi.fn();

      const next = vi.fn();

      const mockUpdatedReview = {
        id: "review-1",
        userId: "user-1",
        gameExternalId: "game-123",
        rating: 4,
        content: "Updated review",
        hoursPlayed: 60,
        playedAt: new Date("2024-01-15"),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockGameReviewService.getById.mockResolvedValue({
        id: "review-1",
        userId: "user-1",
        gameExternalId: "game-123",
        rating: 5,
        content: "Great game!",
        hoursPlayed: 50,
        playedAt: new Date("2024-01-15"),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockGameReviewService.update.mockResolvedValue(mockUpdatedReview);

      await controller.updateReview(req, res, next);

      expect(mockGameReviewService.getById).toHaveBeenCalledWith("review-1");
      expect(mockGameReviewService.update).toHaveBeenCalledWith({
        id: "review-1",
        data: {
          rating: 4,
          content: "Updated review",
          hoursPlayed: 60,
        },
      });
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should throw error if user is not authenticated", async () => {
      const req = createRequest({
        method: "PUT",
        params: { reviewId: "review-1" },
        body: {
          rating: 4,
        },
      });

      const res = createResponse();
      res.status = vi.fn().mockReturnThis();
      res.json = vi.fn();

      const next = vi.fn();

      await controller.updateReview(req, res, next);

      expect(next).toHaveBeenCalledWith(
        new ValidationError("User not authenticated")
      );
    });

    it("should handle errors and call next", async () => {
      const req = createRequest({
        method: "PUT",
        user: { id: "user-1", username: "testuser", email: "test@example.com" },
        params: { reviewId: "review-1" },
        body: {
          rating: 4,
        },
      });

      const res = createResponse();
      res.status = vi.fn().mockReturnThis();
      res.json = vi.fn();

      const next = vi.fn();

      mockGameReviewService.getById.mockResolvedValue({
        id: "review-1",
        userId: "user-1",
        gameExternalId: "game-123",
        rating: 5,
        content: "Great game!",
        hoursPlayed: 50,
        playedAt: new Date("2024-01-15"),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const error = new Error("Database error");
      mockGameReviewService.update.mockRejectedValue(error);

      await controller.updateReview(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("deleteReview", () => {
    it("should delete a review successfully", async () => {
      const req = createRequest({
        method: "DELETE",
        user: { id: "user-1", username: "testuser", email: "test@example.com" },
        params: { reviewId: "review-1" },
      });

      const res = createResponse();
      res.status = vi.fn().mockReturnThis();
      res.json = vi.fn();

      const next = vi.fn();

      mockUserService.getById.mockResolvedValue({
        id: "user-1",
        username: "testuser",
        email: "test@example.com",
        passwordHash: "hashed_password",
        avatarUrl: "",
        bio: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockGameReviewService.getById.mockResolvedValue({
        id: "review-1",
        userId: "user-1",
        gameExternalId: "game-123",
        rating: 5,
        content: "Great game!",
        hoursPlayed: 50,
        playedAt: new Date("2024-01-15"),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockGameReviewService.delete.mockResolvedValue(true);

      await controller.deleteReview(req, res, next);

      expect(mockUserService.getById).toHaveBeenCalledWith("user-1");
      expect(mockGameReviewService.getById).toHaveBeenCalledWith("review-1");
      expect(mockGameReviewService.delete).toHaveBeenCalledWith("review-1");
      expect(res.status).toHaveBeenCalledWith(204);
    });

    it("should throw error if user is not authenticated", async () => {
      const req = createRequest({
        method: "DELETE",
        params: { reviewId: "review-1" },
      });

      const res = createResponse();
      res.status = vi.fn().mockReturnThis();
      res.json = vi.fn();

      const next = vi.fn();

      await controller.deleteReview(req, res, next);

      expect(next).toHaveBeenCalledWith(
        new ValidationError("User not authenticated")
      );
    });

    it("should handle errors and call next", async () => {
      const req = createRequest({
        method: "DELETE",
        user: { id: "user-1", username: "testuser", email: "test@example.com" },
        params: { reviewId: "review-1" },
      });

      const res = createResponse();
      res.status = vi.fn().mockReturnThis();
      res.json = vi.fn();

      const next = vi.fn();

      mockUserService.getById.mockResolvedValue({
        id: "user-1",
        username: "testuser",
        email: "test@example.com",
        passwordHash: "hashed_password",
        avatarUrl: "",
        bio: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockGameReviewService.getById.mockResolvedValue({
        id: "review-1",
        userId: "user-1",
        gameExternalId: "game-123",
        rating: 5,
        content: "Great game!",
        hoursPlayed: 50,
        playedAt: new Date("2024-01-15"),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const error = new Error("Database error");
      mockGameReviewService.delete.mockRejectedValue(error);

      await controller.deleteReview(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("getGameReviews", () => {
    it("should get all reviews for a game successfully", async () => {
      const req = createRequest({
        method: "GET",
        params: { gameId: "game-123" },
      });

      const res = createResponse();
      res.status = vi.fn().mockReturnThis();
      res.json = vi.fn();

      const next = vi.fn();

      const mockReviews = [
        {
          id: "review-1",
          userId: "user-1",
          gameExternalId: "game-123",
          rating: 5,
          content: "Great game!",
          hoursPlayed: 50,
          playedAt: new Date("2024-01-15"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "review-2",
          userId: "user-2",
          gameExternalId: "game-123",
          rating: 4,
          content: "Good game",
          hoursPlayed: 30,
          playedAt: new Date("2024-01-20"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockGameService.getGameById.mockResolvedValue({
        externalId: "game-123",
        title: "Test Game",
        description: "A test game",
        genres: ["Action"],
        rating: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockGameReviewService.getGameReviews.mockResolvedValue(mockReviews);

      await controller.getGameReviews(req, res, next);

      expect(mockGameService.getGameById).toHaveBeenCalledWith("game-123");
      expect(mockGameReviewService.getGameReviews).toHaveBeenCalledWith(
        "game-123"
      );
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return empty array if no reviews found", async () => {
      const req = createRequest({
        method: "GET",
        params: { gameId: "game-123" },
      });

      const res = createResponse();
      res.status = vi.fn().mockReturnThis();
      res.json = vi.fn();

      const next = vi.fn();

      mockGameService.getGameById.mockResolvedValue({
        externalId: "game-123",
        title: "Test Game",
        description: "A test game",
        genres: ["Action"],
        rating: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockGameReviewService.getGameReviews.mockResolvedValue([]);

      await controller.getGameReviews(req, res, next);

      expect(mockGameService.getGameById).toHaveBeenCalledWith("game-123");
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should handle errors and call next", async () => {
      const req = createRequest({
        method: "GET",
        params: { gameId: "game-123" },
      });

      const res = createResponse();
      res.status = vi.fn().mockReturnThis();
      res.json = vi.fn();

      const next = vi.fn();

      mockGameService.getGameById.mockResolvedValue({
        externalId: "game-123",
        title: "Test Game",
        description: "A test game",
        genres: ["Action"],
        rating: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const error = new Error("Database error");
      mockGameReviewService.getGameReviews.mockRejectedValue(error);

      await controller.getGameReviews(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("getUserReviews", () => {
    it("should get all reviews for a user successfully", async () => {
      const req = createRequest({
        method: "GET",
        params: { userId: "user-1" },
      });

      const res = createResponse();
      res.status = vi.fn().mockReturnThis();
      res.json = vi.fn();

      const next = vi.fn();

      const mockReviews = [
        {
          id: "review-1",
          userId: "user-1",
          gameExternalId: "game-123",
          rating: 5,
          content: "Great game!",
          hoursPlayed: 50,
          playedAt: new Date("2024-01-15"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "review-2",
          userId: "user-1",
          gameExternalId: "game-456",
          rating: 4,
          content: "Good game",
          hoursPlayed: 30,
          playedAt: new Date("2024-01-20"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockUserService.getById.mockResolvedValue({
        id: "user-1",
        username: "testuser",
        email: "test@example.com",
        passwordHash: "hashed_password",
        avatarUrl: "",
        bio: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockGameReviewService.getUserReviews.mockResolvedValue(mockReviews);

      await controller.getUserReviews(req, res, next);

      expect(mockUserService.getById).toHaveBeenCalledWith("user-1");
      expect(mockGameReviewService.getUserReviews).toHaveBeenCalledWith(
        "user-1"
      );
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return empty array if no reviews found", async () => {
      const req = createRequest({
        method: "GET",
        params: { userId: "user-1" },
      });

      const res = createResponse();
      res.status = vi.fn().mockReturnThis();
      res.json = vi.fn();

      const next = vi.fn();

      mockUserService.getById.mockResolvedValue({
        id: "user-1",
        username: "testuser",
        email: "test@example.com",
        passwordHash: "hashed_password",
        avatarUrl: "",
        bio: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockGameReviewService.getUserReviews.mockResolvedValue([]);

      await controller.getUserReviews(req, res, next);

      expect(mockUserService.getById).toHaveBeenCalledWith("user-1");
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should handle errors and call next", async () => {
      const req = createRequest({
        method: "GET",
        params: { userId: "user-1" },
      });

      const res = createResponse();
      res.status = vi.fn().mockReturnThis();
      res.json = vi.fn();

      const next = vi.fn();

      // Mock userService so use case reaches the getUserReviews call
      mockUserService.getById.mockResolvedValue({
        id: "user-1",
        username: "testuser",
        email: "test@example.com",
        passwordHash: "hashed_password",
        avatarUrl: "",
        bio: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const error = new Error("Database error");
      mockGameReviewService.getUserReviews.mockRejectedValue(error);

      await controller.getUserReviews(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
