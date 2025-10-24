import { beforeEach, describe, expect, it } from "vitest";
import { mockReset } from "vitest-mock-extended";

import { createMockUser } from "@/entities/__mocks__/mock-user";
import { createMockGameReview } from "@/entities/__mocks__/mock-game-review";
import { createGameReviewServiceMock } from "@/services/__mocks__";
import { createUserServiceMock } from "@/services/__mocks__";
import { getUserReviews } from "./get-user-reviews";

describe("Get User Reviews Use Case", () => {
  const mockUser = createMockUser({
    id: "user-123",
    username: "testuser",
  });

  const mockReviews = [
    createMockGameReview({
      id: "review-1",
      userId: mockUser.id,
      rating: 4,
      content: "Great game!",
    }),
    createMockGameReview({
      id: "review-2",
      userId: mockUser.id,
      rating: 5,
      content: "Amazing game!",
    }),
  ];

  const gameReviewService = createGameReviewServiceMock();
  const userService = createUserServiceMock();

  beforeEach(() => {
    mockReset(gameReviewService);
    mockReset(userService);
  });

  it("should throw error when userId is empty", async () => {
    await expect(
      getUserReviews({
        dependencies: {
          gameReviewService,
          userService,
        },
        payload: {
          userId: "",
        },
      })
    ).rejects.toThrow(Error);
  });

  it("should throw error when user does not exist", async () => {
    userService.getById.mockResolvedValue(undefined);

    await expect(
      getUserReviews({
        dependencies: {
          gameReviewService,
          userService,
        },
        payload: {
          userId: "non-existent",
        },
      })
    ).rejects.toThrow(Error);
    expect(userService.getById).toHaveBeenCalledWith("non-existent");
    expect(userService.getById).toHaveBeenCalledOnce();
  });

  it("should return empty array when user has no reviews", async () => {
    userService.getById.mockResolvedValue(mockUser);
    gameReviewService.getUserReviews.mockResolvedValue([]);

    const result = await getUserReviews({
      dependencies: {
        gameReviewService,
        userService,
      },
      payload: {
        userId: mockUser.id,
      },
    });

    expect(result).toEqual([]);
    expect(userService.getById).toHaveBeenCalledWith(mockUser.id);
    expect(gameReviewService.getUserReviews).toHaveBeenCalledWith(mockUser.id);
    expect(userService.getById).toHaveBeenCalledOnce();
    expect(gameReviewService.getUserReviews).toHaveBeenCalledOnce();
  });

  it("should get reviews successfully", async () => {
    userService.getById.mockResolvedValue(mockUser);
    gameReviewService.getUserReviews.mockResolvedValue(mockReviews);

    const result = await getUserReviews({
      dependencies: {
        gameReviewService,
        userService,
      },
      payload: {
        userId: mockUser.id,
      },
    });

    expect(result).toEqual(mockReviews);
    expect(userService.getById).toHaveBeenCalledWith(mockUser.id);
    expect(gameReviewService.getUserReviews).toHaveBeenCalledWith(mockUser.id);
    expect(userService.getById).toHaveBeenCalledOnce();
    expect(gameReviewService.getUserReviews).toHaveBeenCalledOnce();
  });
});
