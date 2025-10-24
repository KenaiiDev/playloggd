import { beforeEach, describe, expect, it } from "vitest";
import { mockReset } from "vitest-mock-extended";

import { GameStatusEnum } from "@/entities/game-entry";
import { createMockGame } from "@/entities/__mocks__/mock-game";
import { createMockUser } from "@/entities/__mocks__/mock-user";
import { createGameEntryServiceMock } from "@/services/__mocks__/";
import { createGameServiceMock } from "@/services/__mocks__/";
import { getCollection } from "./get-collection";

describe("Get Collection Use Case", () => {
  const mockUser = createMockUser({
    id: "user-123",
  });

  const mockGames = [
    createMockGame({
      externalId: "game-123",
      title: "The Last of Us",
      coverUrl: "cover1.jpg",
    }),
    createMockGame({
      externalId: "game-456",
      title: "God of War",
      coverUrl: "cover2.jpg",
    }),
    createMockGame({
      externalId: "game-789",
      title: "Horizon Zero Dawn",
      coverUrl: "cover3.jpg",
    }),
  ];

  const mockUserGames = [
    {
      id: "user-game-1",
      userId: mockUser.id,
      gameExternalId: "game-123",
      status: GameStatusEnum.PLAYING,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "user-game-2",
      userId: mockUser.id,
      gameExternalId: "game-456",
      status: GameStatusEnum.COMPLETED,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "user-game-3",
      userId: mockUser.id,
      gameExternalId: "game-789",
      status: GameStatusEnum.WISHLIST,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const userGameService = createGameEntryServiceMock();
  const gameService = createGameServiceMock();

  beforeEach(() => {
    mockReset(userGameService);
    mockReset(gameService);
  });

  it("should return user's collection with game details successfully", async () => {
    const payload = {
      userId: mockUser.id,
    };

    userGameService.getUserGames.mockResolvedValue(mockUserGames);
    mockUserGames.forEach((userGame, index) => {
      gameService.getGameById.mockResolvedValueOnce(mockGames[index]);
    });

    const result = await getCollection({
      dependencies: { userGameService, gameService },
      payload,
    });

    expect(result).toEqual(
      mockUserGames.map((userGame, index) => ({
        ...userGame,
        game: {
          title: mockGames[index].title,
          coverUrl: mockGames[index].coverUrl,
          externalId: mockGames[index].externalId,
        },
      }))
    );
    expect(userGameService.getUserGames).toHaveBeenCalledWith(mockUser.id);
    mockUserGames.forEach((userGame) => {
      expect(gameService.getGameById).toHaveBeenCalledWith(
        userGame.gameExternalId
      );
    });
  });

  it("should return empty array when user has no games", async () => {
    const payload = {
      userId: mockUser.id,
    };

    userGameService.getUserGames.mockResolvedValue([]);

    const result = await getCollection({
      dependencies: { userGameService },
      payload,
    });

    expect(result).toEqual([]);
    expect(userGameService.getUserGames).toHaveBeenCalledWith(mockUser.id);
  });

  it("should throw error when userId is empty", async () => {
    const payload = {
      userId: "",
    };

    await expect(
      getCollection({
        dependencies: { userGameService },
        payload,
      })
    ).rejects.toThrow(Error);
    expect(userGameService.getUserGames).not.toHaveBeenCalled();
  });

  it("should filter collection by status when provided", async () => {
    const payload = {
      userId: mockUser.id,
      status: GameStatusEnum.PLAYING,
    };

    userGameService.getUserGames.mockResolvedValue(mockUserGames);

    const result = await getCollection({
      dependencies: { userGameService },
      payload,
    });

    expect(result).toEqual([mockUserGames[0]]);
    expect(userGameService.getUserGames).toHaveBeenCalledWith(mockUser.id);
  });

  it("should return empty array when no games match status", async () => {
    const payload = {
      userId: mockUser.id,
      status: GameStatusEnum.DROPPED,
    };

    userGameService.getUserGames.mockResolvedValue(mockUserGames);

    const result = await getCollection({
      dependencies: { userGameService },
      payload,
    });

    expect(result).toEqual([]);
    expect(userGameService.getUserGames).toHaveBeenCalledWith(mockUser.id);
  });
});
