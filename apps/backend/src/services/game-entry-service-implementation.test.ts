import { describe, it, expect, beforeEach, vi } from "vitest";
import { PrismaClient } from "@prisma/client";
import { GameEntryServiceImplementation } from "./game-entry-service-implementation";
import { createMockGameEntry } from "@playloggd/domain";
import { GameStatusEnum } from "@playloggd/domain";

vi.mock("@prisma/client", () => {
  const mockPrisma = {
    gameEntry: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  };
  return { PrismaClient: vi.fn(() => mockPrisma) };
});

describe("GameEntryServiceImplementation", () => {
  let prisma: PrismaClient;
  let gameEntryService: GameEntryServiceImplementation;

  const mockPrisma = {
    gameEntry: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  };

  beforeEach(() => {
    prisma = mockPrisma as unknown as PrismaClient;
    gameEntryService = new GameEntryServiceImplementation(prisma);
    vi.clearAllMocks();
  });

  describe("findUserGame", () => {
    it("should return a game entry when found", async () => {
      const mockGameEntry = createMockGameEntry({
        userId: "user1",
        gameExternalId: "game1",
        status: GameStatusEnum.PLAYING,
      });

      const mockReturnedEntry = {
        ...mockGameEntry,
        id: "entry1",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.gameEntry.findUnique.mockResolvedValue(mockReturnedEntry);

      const result = await gameEntryService.findGameEntry("user1", "game1");

      expect(result).toStrictEqual(mockReturnedEntry);
      expect(mockPrisma.gameEntry.findUnique).toHaveBeenCalledWith({
        where: {
          userId_gameExternalId: {
            userId: "user1",
            gameExternalId: "game1",
          },
        },
      });
    });

    it("should return undefined when game entry is not found", async () => {
      mockPrisma.gameEntry.findUnique.mockResolvedValue(null);

      const result = await gameEntryService.findGameEntry("user1", "game1");

      expect(result).toBeUndefined();
      expect(mockPrisma.gameEntry.findUnique).toHaveBeenCalledWith({
        where: {
          userId_gameExternalId: {
            userId: "user1",
            gameExternalId: "game1",
          },
        },
      });
    });
  });

  describe("addUserGame", () => {
    it("should create a new game entry", async () => {
      const newGameEntry = {
        userId: "user1",
        gameExternalId: "game1",
        status: GameStatusEnum.BACKLOG,
      };

      const mockCreatedEntry = {
        ...newGameEntry,
        id: "entry1",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.gameEntry.create.mockResolvedValue(mockCreatedEntry);

      const result = await gameEntryService.addGameEntry(newGameEntry);

      expect(result).toStrictEqual(mockCreatedEntry);
      expect(mockPrisma.gameEntry.create).toHaveBeenCalledWith({
        data: { ...newGameEntry, status: newGameEntry.status.toUpperCase() },
      });
    });

    it("should create a game entry with PLAYING status", async () => {
      const newGameEntry = {
        userId: "user2",
        gameExternalId: "game2",
        status: GameStatusEnum.PLAYING,
      };

      const mockCreatedEntry = {
        ...newGameEntry,
        id: "entry2",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.gameEntry.create.mockResolvedValue(mockCreatedEntry);

      const result = await gameEntryService.addGameEntry(newGameEntry);

      expect(result).toStrictEqual(mockCreatedEntry);
      expect(result.status).toBe(GameStatusEnum.PLAYING);
      expect(mockPrisma.gameEntry.create).toHaveBeenCalledWith({
        data: { ...newGameEntry, status: newGameEntry.status.toUpperCase() },
      });
    });
  });

  describe("removeUserGame", () => {
    it("should delete a game entry and return undefined", async () => {
      mockPrisma.gameEntry.delete.mockResolvedValue({
        id: "entry1",
        userId: "user1",
        gameExternalId: "game1",
        status: GameStatusEnum.COMPLETED,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await gameEntryService.removeGameEntry("user1", "game1");

      expect(result).toBeUndefined();
      expect(mockPrisma.gameEntry.delete).toHaveBeenCalledWith({
        where: {
          userId_gameExternalId: {
            userId: "user1",
            gameExternalId: "game1",
          },
        },
      });
    });
  });

  describe("getUserGames", () => {
    it("should return all game entries for a user", async () => {
      const mockGameEntries = [
        createMockGameEntry({
          userId: "user1",
          gameExternalId: "game1",
          status: GameStatusEnum.PLAYING,
        }),
        createMockGameEntry({
          userId: "user1",
          gameExternalId: "game2",
          status: GameStatusEnum.COMPLETED,
        }),
        createMockGameEntry({
          userId: "user1",
          gameExternalId: "game3",
          status: GameStatusEnum.BACKLOG,
        }),
      ];

      const mockReturnedEntries = mockGameEntries.map((entry, index) => ({
        ...entry,
        id: `entry${index + 1}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      mockPrisma.gameEntry.findMany.mockResolvedValue(mockReturnedEntries);

      const result = await gameEntryService.getUserGameEntries("user1");

      expect(result).toHaveLength(3);
      expect(result).toStrictEqual(mockReturnedEntries);
      expect(mockPrisma.gameEntry.findMany).toHaveBeenCalledWith({
        where: { userId: "user1" },
      });
    });

    it("should return empty array when user has no game entries", async () => {
      mockPrisma.gameEntry.findMany.mockResolvedValue([]);

      const result = await gameEntryService.getUserGameEntries("user1");

      expect(result).toHaveLength(0);
      expect(result).toStrictEqual([]);
      expect(mockPrisma.gameEntry.findMany).toHaveBeenCalledWith({
        where: { userId: "user1" },
      });
    });
  });

  describe("updateGameStatus", () => {
    it("should update the status of a game entry", async () => {
      const updateData = {
        userId: "user1",
        gameExternalId: "game1",
        status: GameStatusEnum.COMPLETED,
      };

      const mockUpdatedEntry = {
        id: "entry1",
        ...updateData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.gameEntry.update.mockResolvedValue(mockUpdatedEntry);

      const result = await gameEntryService.updateGameStatus(updateData);

      expect(result).toStrictEqual(mockUpdatedEntry);
      expect(result.status).toBe(GameStatusEnum.COMPLETED);
      expect(mockPrisma.gameEntry.update).toHaveBeenCalledWith({
        where: {
          userId_gameExternalId: {
            userId: "user1",
            gameExternalId: "game1",
          },
        },
        data: {
          status: GameStatusEnum.COMPLETED.toUpperCase(),
        },
      });
    });

    it("should update status from PLAYING to WANT_TO_PLAY", async () => {
      const updateData = {
        userId: "user2",
        gameExternalId: "game2",
        status: GameStatusEnum.BACKLOG,
      };

      const mockUpdatedEntry = {
        id: "entry2",
        ...updateData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.gameEntry.update.mockResolvedValue(mockUpdatedEntry);

      const result = await gameEntryService.updateGameStatus(updateData);

      expect(result).toStrictEqual(mockUpdatedEntry);
      expect(result.status).toBe(GameStatusEnum.BACKLOG);
      expect(mockPrisma.gameEntry.update).toHaveBeenCalledWith({
        where: {
          userId_gameExternalId: {
            userId: "user2",
            gameExternalId: "game2",
          },
        },
        data: {
          status: GameStatusEnum.BACKLOG.toUpperCase(),
        },
      });
    });

    it("should update status from WANT_TO_PLAY to DROPPED", async () => {
      const updateData = {
        userId: "user3",
        gameExternalId: "game3",
        status: GameStatusEnum.DROPPED,
      };

      const mockUpdatedEntry = {
        id: "entry3",
        ...updateData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.gameEntry.update.mockResolvedValue(mockUpdatedEntry);

      const result = await gameEntryService.updateGameStatus(updateData);

      expect(result).toStrictEqual(mockUpdatedEntry);
      expect(result.status).toBe(GameStatusEnum.DROPPED);
      expect(mockPrisma.gameEntry.update).toHaveBeenCalledWith({
        where: {
          userId_gameExternalId: {
            userId: "user3",
            gameExternalId: "game3",
          },
        },
        data: {
          status: GameStatusEnum.DROPPED.toUpperCase(),
        },
      });
    });
  });
});
