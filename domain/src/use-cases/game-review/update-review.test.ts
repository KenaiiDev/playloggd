import { beforeEach, describe, expect, it } from "vitest";
import { mockReset } from "vitest-mock-extended";

import { createMockGame } from "@/entities/__mocks__/mock-game";
import { createMockUser } from "@/entities/__mocks__/mock-user";
import { createMockGameReview } from "@/entities/__mocks__/mock-game-review";
import { createGameReviewServiceMock } from "@/services/__mocks__";
import { createUserServiceMock } from "@/services/__mocks__";
import { createGameServiceMock } from "@/services/__mocks__";
import { updateReview } from "./update-review";

describe("Update Review Use Case", () => {
  const mockGame = createMockGame({
    externalId: "game-123",
    title: "The Last of Us",
  });

  const mockUser = createMockUser({
    id: "user-123",
  });

  const mockReview = createMockGameReview({
    id: "review-123",
    userId: mockUser.id,
    gameExternalId: mockGame.externalId,
    rating: 4,
    content: "Original review",
  });

  const gameReviewService = createGameReviewServiceMock();
  const userService = createUserServiceMock();
  const gameService = createGameServiceMock();

  beforeEach(() => {
    mockReset(gameReviewService);
    mockReset(userService);
    mockReset(gameService);
  });

  it("should update review successfully", async () => {
    const payload = {
      reviewId: mockReview.id,
      rating: 5,
      content: "Updated review",
      hoursPlayed: 50,
    };

    const expectedReview = {
      ...mockReview,
      ...payload,
      updatedAt: new Date(),
    };

    gameService.getGameById.mockResolvedValue(mockGame);
    gameReviewService.getById.mockResolvedValue(mockReview);
    gameReviewService.update.mockResolvedValue(expectedReview);

    const result = await updateReview({
      dependencies: { gameReviewService, userService, gameService },
      payload,
    });

    expect(result).toEqual(expectedReview);
    expect(gameReviewService.getById).toHaveBeenCalledWith(mockReview.id);
    expect(gameReviewService.update).toHaveBeenCalledWith({
      id: mockReview.id,
      data: {
        rating: payload.rating,
        content: payload.content,
        hoursPlayed: payload.hoursPlayed,
      },
    });
  });

  it("should return error when review does not exist", async () => {
    const payload = {
      reviewId: "non-existent-review",
      rating: 5,
      content: "Updated review",
    };

    gameReviewService.getById.mockResolvedValue(undefined);

    const result = await updateReview({
      dependencies: { gameReviewService, userService, gameService },
      payload,
    });

    expect(result).toBeInstanceOf(Error);
    expect(gameReviewService.getById).toHaveBeenCalledWith(payload.reviewId);
    expect(gameReviewService.update).not.toHaveBeenCalled();
  });

  it("should return error when rating is invalid", async () => {
    const payload = {
      reviewId: mockReview.id,
      userId: mockUser.id,
      rating: 6,
      content: "Updated review",
    };

    const result = await updateReview({
      dependencies: { gameReviewService, userService, gameService },
      payload,
    });

    expect(result).toBeInstanceOf(Error);
    expect(userService.getById).not.toHaveBeenCalled();
    expect(gameReviewService.getById).not.toHaveBeenCalled();
    expect(gameReviewService.update).not.toHaveBeenCalled();
  });

  it("should return error when reviewId is empty", async () => {
    const payload = {
      reviewId: "",
      userId: mockUser.id,
      rating: 4,
      content: "Updated review",
    };

    const result = await updateReview({
      dependencies: { gameReviewService, userService, gameService },
      payload,
    });

    expect(result).toBeInstanceOf(Error);
    expect(userService.getById).not.toHaveBeenCalled();
    expect(gameReviewService.getById).not.toHaveBeenCalled();
    expect(gameReviewService.update).not.toHaveBeenCalled();
  });
});
