import { createRequest, createResponse } from "node-mocks-http";
import { describe, it, expect, beforeEach, vi } from "vitest";

import { GameEntryController } from "./game-entry-controller";
import {
  GameEntry,
  GameEntryService,
  GameService,
  GameStatusEnum as GameStatus,
  ValidationError,
} from "@playloggd/domain";
import { DeepMockProxy, mockDeep } from "vitest-mock-extended";

vi.mock("../services/game-entry-service-implementation");

describe("GameEntryController", () => {
  let gameEntryController: GameEntryController;
  let gameEntryServiceMock: DeepMockProxy<GameEntryService>;
  let gameServiceMock: DeepMockProxy<GameService>;

  const mockGameEntry: GameEntry = {
    id: "entry-1",
    userId: "user-1",
    gameExternalId: "game-1",
    status: GameStatus.PLAYING,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    gameEntryServiceMock = mockDeep<GameEntryService>();
    gameServiceMock = mockDeep<GameService>();
    gameEntryController = new GameEntryController(
      gameEntryServiceMock,
      gameServiceMock
    );
  });

  describe("addToCollection", () => {
    it("should add a game to user collection successfully", async () => {
      const req = createRequest({
        method: "POST",
        url: "/game-entries",
        body: {
          gameExternalId: "game-1",
          status: GameStatus.BACKLOG,
        },
      });
      req.user = { id: "user-1" };

      const res = createResponse();
      res.status = vi.fn().mockReturnThis();
      res.json = vi.fn();
      const next = vi.fn();

      const newEntry = {
        ...mockGameEntry,
        status: GameStatus.BACKLOG,
      };

      gameEntryServiceMock.findGameEntry.mockResolvedValue(undefined);
      gameEntryServiceMock.addGameEntry.mockResolvedValue(newEntry);

      await gameEntryController.addToCollection(req, res, next);

      expect(gameEntryServiceMock.findGameEntry).toHaveBeenCalledWith(
        "user-1",
        "game-1"
      );
      expect(gameEntryServiceMock.addGameEntry).toHaveBeenCalledWith({
        userId: "user-1",
        gameExternalId: "game-1",
        status: GameStatus.BACKLOG,
      });
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("should handle missing user authentication", async () => {
      const req = createRequest({
        method: "POST",
        url: "/game-entries",
        body: {
          gameExternalId: "game-1",
          status: GameStatus.BACKLOG,
        },
      });

      const res = createResponse();
      const next = vi.fn();

      await gameEntryController.addToCollection(req, res, next);

      expect(next).toHaveBeenCalledWith(
        new ValidationError("User not authenticated")
      );
    });

    it("should handle missing gameExternalId", async () => {
      const req = createRequest({
        method: "POST",
        url: "/game-entries",
        body: {
          status: GameStatus.BACKLOG,
        },
      });
      req.user = { id: "user-1" };

      const res = createResponse();
      const next = vi.fn();

      await gameEntryController.addToCollection(req, res, next);

      expect(next).toHaveBeenCalledWith(
        new ValidationError("Game id is required")
      );
    });

    it("should handle duplicate entry attempt", async () => {
      const req = createRequest({
        method: "POST",
        url: "/game-entries",
        body: {
          gameExternalId: "game-1",
          status: GameStatus.PLAYING,
        },
      });
      req.user = { id: "user-1" };

      const res = createResponse();
      const next = vi.fn();

      gameEntryServiceMock.findGameEntry.mockResolvedValue(mockGameEntry);

      await gameEntryController.addToCollection(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("removeFromCollection", () => {
    it("should remove a game from user collection successfully", async () => {
      const req = createRequest({
        method: "DELETE",
        url: "/game-entries/game-1",
        params: {
          gameExternalId: "game-1",
        },
      });
      req.user = { id: "user-1" };

      const res = createResponse();
      res.status = vi.fn().mockReturnThis();
      res.json = vi.fn();
      const next = vi.fn();

      gameEntryServiceMock.findGameEntry.mockResolvedValue(mockGameEntry);
      gameEntryServiceMock.removeGameEntry.mockResolvedValue(undefined);

      await gameEntryController.removeFromCollection(req, res, next);

      expect(gameEntryServiceMock.findGameEntry).toHaveBeenCalledWith(
        "user-1",
        "game-1"
      );
      expect(gameEntryServiceMock.removeGameEntry).toHaveBeenCalledWith(
        "user-1",
        "game-1"
      );
      expect(res.status).toHaveBeenCalledWith(204);
    });

    it("should handle missing user authentication in removeFromCollection", async () => {
      const req = createRequest({
        method: "DELETE",
        url: "/game-entries/game-1",
        params: {
          gameExternalId: "game-1",
        },
      });
      // No user

      const res = createResponse();
      const next = vi.fn();

      await gameEntryController.removeFromCollection(req, res, next);

      expect(next).toHaveBeenCalledWith(
        new ValidationError("User not authenticated")
      );
    });

    it("should handle entry not found", async () => {
      const req = createRequest({
        method: "DELETE",
        url: "/game-entries/game-1",
        params: {
          gameExternalId: "game-1",
        },
      });
      req.user = { id: "user-1" };

      const res = createResponse();
      const next = vi.fn();

      gameEntryServiceMock.findGameEntry.mockResolvedValue(undefined);

      await gameEntryController.removeFromCollection(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("getCollection", () => {
    it("should return user's game collection", async () => {
      const req = createRequest({
        method: "GET",
        url: "/users/user-1/collection",
        params: { userId: "user-1" },
        query: {},
      });

      const res = createResponse();
      res.status = vi.fn().mockReturnThis();
      res.json = vi.fn();
      const next = vi.fn();

      const collection = [
        mockGameEntry,
        { ...mockGameEntry, id: "entry-2", status: GameStatus.COMPLETED },
      ];

      gameEntryServiceMock.getUserGameEntries.mockResolvedValue(collection);

      await gameEntryController.getCollection(req, res, next);

      expect(gameEntryServiceMock.getUserGameEntries).toHaveBeenCalledWith(
        "user-1"
      );
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should filter collection by status", async () => {
      const req = createRequest({
        method: "GET",
        url: "/users/user-1/collection",
        params: { userId: "user-1" },
        query: {
          status: GameStatus.PLAYING,
        },
      });

      const res = createResponse();
      res.status = vi.fn().mockReturnThis();
      res.json = vi.fn();
      const next = vi.fn();

      const filteredCollection = [mockGameEntry];

      gameEntryServiceMock.getUserGameEntries.mockResolvedValue(
        filteredCollection
      );

      await gameEntryController.getCollection(req, res, next);

      expect(gameEntryServiceMock.getUserGameEntries).toHaveBeenCalledWith(
        "user-1"
      );
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should handle missing userId parameter", async () => {
      const req = createRequest({
        method: "GET",
        url: "/users//collection",
        params: {},
        query: {},
      });

      const res = createResponse();
      const next = vi.fn();

      await gameEntryController.getCollection(req, res, next);

      expect(next).toHaveBeenCalledWith(
        new ValidationError("User id is required")
      );
    });

    it("should return empty collection for user with no entries", async () => {
      const req = createRequest({
        method: "GET",
        url: "/users/user-1/collection",
        params: { userId: "user-1" },
        query: {},
      });

      const res = createResponse();
      res.status = vi.fn().mockReturnThis();
      res.json = vi.fn();
      const next = vi.fn();

      gameEntryServiceMock.getUserGameEntries.mockResolvedValue([]);

      await gameEntryController.getCollection(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: [],
        status: 200,
        statusMsg: "Success",
      });
    });
  });

  describe("updateGameStatus", () => {
    it("should update game status successfully", async () => {
      const req = createRequest({
        method: "PATCH",
        url: "/game-entries/game-1/status",
        params: {
          gameExternalId: "game-1",
        },
        body: {
          status: GameStatus.COMPLETED,
        },
      });
      req.user = { id: "user-1" };

      const res = createResponse();
      res.status = vi.fn().mockReturnThis();
      res.json = vi.fn();
      const next = vi.fn();

      const updatedEntry = {
        ...mockGameEntry,
        status: GameStatus.COMPLETED,
      };

      gameEntryServiceMock.updateGameStatus.mockResolvedValue(updatedEntry);

      await gameEntryController.updateGameStatus(req, res, next);

      expect(gameEntryServiceMock.updateGameStatus).toHaveBeenCalledWith({
        userId: "user-1",
        gameExternalId: "game-1",
        status: GameStatus.COMPLETED,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: updatedEntry,
        status: 200,
        statusMsg: "Success",
      });
    });

    it("should handle missing user authentication in updateGameStatus", async () => {
      const req = createRequest({
        method: "PATCH",
        url: "/game-entries/game-1/status",
        params: {
          gameExternalId: "game-1",
        },
        body: {
          status: GameStatus.COMPLETED,
        },
      });
      // No user

      const res = createResponse();
      const next = vi.fn();

      await gameEntryController.updateGameStatus(req, res, next);

      expect(next).toHaveBeenCalledWith(
        new ValidationError("User not authenticated")
      );
    });

    it("should handle missing status in request body", async () => {
      const req = createRequest({
        method: "PATCH",
        url: "/game-entries/game-1/status",
        params: {
          gameExternalId: "game-1",
        },
        body: {},
      });
      req.user = { id: "user-1" };

      const res = createResponse();
      const next = vi.fn();

      await gameEntryController.updateGameStatus(req, res, next);

      expect(next).toHaveBeenCalledWith(
        new ValidationError("Game status is required")
      );
    });

    it("should update status from BACKLOG to PLAYING", async () => {
      const req = createRequest({
        method: "PATCH",
        url: "/game-entries/game-1/status",
        params: {
          gameExternalId: "game-1",
        },
        body: {
          status: GameStatus.PLAYING,
        },
      });
      req.user = { id: "user-1" };

      const res = createResponse();
      res.status = vi.fn().mockReturnThis();
      res.json = vi.fn();
      const next = vi.fn();

      const updatedEntry = {
        ...mockGameEntry,
        status: GameStatus.PLAYING,
      };

      gameEntryServiceMock.updateGameStatus.mockResolvedValue(updatedEntry);

      await gameEntryController.updateGameStatus(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: updatedEntry,
        status: 200,
        statusMsg: "Success",
      });
    });

    it("should update status from PLAYING to DROPPED", async () => {
      const req = createRequest({
        method: "PATCH",
        url: "/game-entries/game-1/status",
        params: {
          gameExternalId: "game-1",
        },
        body: {
          status: GameStatus.DROPPED,
        },
      });
      req.user = { id: "user-1" };

      const res = createResponse();
      res.status = vi.fn().mockReturnThis();
      res.json = vi.fn();
      const next = vi.fn();

      const updatedEntry = {
        ...mockGameEntry,
        status: GameStatus.DROPPED,
      };

      gameEntryServiceMock.updateGameStatus.mockResolvedValue(updatedEntry);

      await gameEntryController.updateGameStatus(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
