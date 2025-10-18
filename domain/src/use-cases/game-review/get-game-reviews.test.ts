import { beforeEach, describe, expect, it } from "vitest";
import { mockReset } from "vitest-mock-extended";

import { createMockGame } from "@/entities/__mocks__/mock-game";
import { createMockGameReview } from "@/entities/__mocks__/mock-game-review";
import { createGameReviewServiceMock } from "@/services/__mocks__";
import { createGameServiceMock } from "@/services/__mocks__";
import { getGameReviews } from "./get-game-reviews";

describe("Get Game Reviews Use Case", () => {
  const mockGame = createMockGame({
    externalId: "game-123",
    title: "The Last of Us",
  });

  const mockReviews = [
    createMockGameReview({
      id: "review-1",
      gameExternalId: mockGame.externalId,
      rating: 4,
      content: "Great game!",
    }),
    createMockGameReview({
      id: "review-2",
      gameExternalId: mockGame.externalId,
      rating: 5,
      content: "Amazing game!",
    }),
  ];

  const gameReviewService = createGameReviewServiceMock();
  const gameService = createGameServiceMock();

  beforeEach(() => {
    mockReset(gameReviewService);
    mockReset(gameService);
  });

  it("should fail when gameId is empty", async () => {
    const result = await getGameReviews({
      dependencies: {
        gameReviewService,
        gameService,
      },
      payload: {
        gameId: "",
      },
    });

    expect(result).toBeInstanceOf(Error);
  });

  it("should fail when game does not exist", async () => {
    gameService.getGameById.mockResolvedValue(undefined);

    const result = await getGameReviews({
      dependencies: {
        gameReviewService,
        gameService,
      },
      payload: {
        gameId: "non-existent",
      },
    });

    expect(result).toBeInstanceOf(Error);
    expect(gameService.getGameById).toHaveBeenCalledWith("non-existent");
    expect(gameService.getGameById).toHaveBeenCalledOnce();
  });

  it("should return empty array when game has no reviews", async () => {
    gameService.getGameById.mockResolvedValue(mockGame);
    gameReviewService.getGameReviews.mockResolvedValue([]);

    const result = await getGameReviews({
      dependencies: {
        gameReviewService,
        gameService,
      },
      payload: {
        gameId: mockGame.externalId,
      },
    });

    expect(result).toEqual([]);
    expect(gameService.getGameById).toHaveBeenCalledWith(mockGame.externalId);
    expect(gameReviewService.getGameReviews).toHaveBeenCalledWith(
      mockGame.externalId
    );
    expect(gameService.getGameById).toHaveBeenCalledOnce();
    expect(gameReviewService.getGameReviews).toHaveBeenCalledOnce();
  });

  it("should get reviews successfully", async () => {
    gameService.getGameById.mockResolvedValue(mockGame);
    gameReviewService.getGameReviews.mockResolvedValue(mockReviews);

    const result = await getGameReviews({
      dependencies: {
        gameReviewService,
        gameService,
      },
      payload: {
        gameId: mockGame.externalId,
      },
    });

    expect(result).toEqual(mockReviews);
    expect(gameService.getGameById).toHaveBeenCalledWith(mockGame.externalId);
    expect(gameReviewService.getGameReviews).toHaveBeenCalledWith(
      mockGame.externalId
    );
    expect(gameService.getGameById).toHaveBeenCalledOnce();
    expect(gameReviewService.getGameReviews).toHaveBeenCalledOnce();
  });
});
