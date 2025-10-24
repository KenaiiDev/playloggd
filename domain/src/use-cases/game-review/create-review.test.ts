import { beforeEach, describe, expect, it } from "vitest";
import { mockReset } from "vitest-mock-extended";

import { createMockGame } from "@/entities/__mocks__/mock-game";
import { createMockUser } from "@/entities/__mocks__/mock-user";
import { createGameReviewServiceMock } from "@/services/__mocks__";
import { createUserServiceMock } from "@/services/__mocks__";
import { createGameServiceMock } from "@/services/__mocks__";
import { createReview } from "./create-review";

describe("Create Review Use Case", () => {
  const mockGame = createMockGame({
    externalId: "game-123",
    title: "The Last of Us",
  });

  const mockUser = createMockUser({
    id: "user-123",
  });

  const gameReviewService = createGameReviewServiceMock();
  const userService = createUserServiceMock();
  const gameService = createGameServiceMock();

  beforeEach(() => {
    mockReset(gameReviewService);
    mockReset(userService);
    mockReset(gameService);
  });

  it("should create review successfully", async () => {
    const payload = {
      userId: mockUser.id,
      gameExternalId: mockGame.externalId,
      rating: 4,
      content: "Great game!",
      hoursPlayed: 40,
      playedAt: new Date(),
    };

    const expectedReview = {
      id: "review-1",
      ...payload,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    userService.getById.mockResolvedValue(mockUser);
    gameService.getGameById.mockResolvedValue(mockGame);
    gameReviewService.getUserGameReview.mockResolvedValue(undefined);
    gameReviewService.create.mockResolvedValue(expectedReview);

    const result = await createReview({
      dependencies: { gameReviewService, userService, gameService },
      payload,
    });

    expect(result).toEqual(expectedReview);
    expect(gameReviewService.getUserGameReview).toHaveBeenCalledWith(
      mockUser.id,
      mockGame.externalId
    );
    expect(gameReviewService.create).toHaveBeenCalledWith(payload);
    expect(userService.getById).toHaveBeenCalled();
    expect(gameService.getGameById).toHaveBeenCalled();
  });

  it("should throw error if review already exists", async () => {
    const payload = {
      userId: mockUser.id,
      gameExternalId: mockGame.externalId,
      rating: 4,
      content: "Great game!",
      hoursPlayed: 40,
      playedAt: new Date(),
    };

    const existingReview = {
      id: "existing-review",
      ...payload,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    userService.getById.mockResolvedValue(mockUser);
    gameService.getGameById.mockResolvedValue(mockGame);
    gameReviewService.getUserGameReview.mockResolvedValue(existingReview);

    await expect(
      createReview({
        dependencies: { gameReviewService, userService, gameService },
        payload,
      })
    ).rejects.toThrow(Error);
    expect(gameReviewService.getUserGameReview).toHaveBeenCalledWith(
      mockUser.id,
      mockGame.externalId
    );
    expect(gameReviewService.create).not.toHaveBeenCalled();
  });

  it("should throw error when userId is empty", async () => {
    const payload = {
      userId: "",
      gameExternalId: mockGame.externalId,
      rating: 4,
      content: "Great game!",
    };

    await expect(
      createReview({
        dependencies: { gameReviewService },
        payload,
      })
    ).rejects.toThrow(Error);
    expect(gameReviewService.getUserGameReview).not.toHaveBeenCalled();
    expect(gameReviewService.create).not.toHaveBeenCalled();
  });

  it("should throw error when gameExternalId is empty", async () => {
    const payload = {
      userId: mockUser.id,
      gameExternalId: "",
      rating: 4,
      content: "Great game!",
    };

    await expect(
      createReview({
        dependencies: { gameReviewService },
        payload,
      })
    ).rejects.toThrow(Error);
    expect(gameReviewService.getUserGameReview).not.toHaveBeenCalled();
    expect(gameReviewService.create).not.toHaveBeenCalled();
  });

  it("should throw error when rating is invalid", async () => {
    const payload = {
      userId: mockUser.id,
      gameExternalId: mockGame.externalId,
      rating: 6,
      content: "Great game!",
    };

    await expect(
      createReview({
        dependencies: { gameReviewService, userService, gameService },
        payload,
      })
    ).rejects.toThrow(Error);
    expect(userService.getById).not.toHaveBeenCalled();
    expect(gameService.getGameById).not.toHaveBeenCalled();
    expect(gameReviewService.getUserGameReview).not.toHaveBeenCalled();
    expect(gameReviewService.create).not.toHaveBeenCalled();
  });

  it("should throw error when user does not exist", async () => {
    const payload = {
      userId: mockUser.id,
      gameExternalId: mockGame.externalId,
      rating: 4,
      content: "Great game!",
    };

    userService.getById.mockResolvedValue(undefined);

    await expect(
      createReview({
        dependencies: { gameReviewService, userService, gameService },
        payload,
      })
    ).rejects.toThrow(Error);
    expect(userService.getById).toHaveBeenCalledWith(mockUser.id);
    expect(gameService.getGameById).not.toHaveBeenCalled();
    expect(gameReviewService.getUserGameReview).not.toHaveBeenCalled();
    expect(gameReviewService.create).not.toHaveBeenCalled();
  });

  it("should throw error when game does not exist", async () => {
    const payload = {
      userId: mockUser.id,
      gameExternalId: mockGame.externalId,
      rating: 4,
      content: "Great game!",
    };

    userService.getById.mockResolvedValue(mockUser);
    gameService.getGameById.mockResolvedValue(undefined);

    await expect(
      createReview({
        dependencies: { gameReviewService, userService, gameService },
        payload,
      })
    ).rejects.toThrow(Error);
    expect(userService.getById).toHaveBeenCalledWith(mockUser.id);
    expect(gameService.getGameById).toHaveBeenCalledWith(mockGame.externalId);
    expect(gameReviewService.getUserGameReview).not.toHaveBeenCalled();
    expect(gameReviewService.create).not.toHaveBeenCalled();
  });
});
