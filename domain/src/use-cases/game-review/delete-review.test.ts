import { beforeEach, describe, expect, it } from "vitest";
import { mockReset } from "vitest-mock-extended";

import { createMockGame } from "@/entities/__mocks__/mock-game";
import { createMockUser } from "@/entities/__mocks__/mock-user";
import { createMockGameReview } from "@/entities/__mocks__/mock-game-review";
import { createGameReviewServiceMock } from "@/services/__mocks__";
import { createUserServiceMock } from "@/services/__mocks__";
import { deleteReview } from "./delete-review";

describe("Delete Review Use Case", () => {
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

  beforeEach(() => {
    mockReset(gameReviewService);
    mockReset(userService);
  });


  it("should throw error when reviewId is empty", async () => {
    await expect(
      deleteReview({
        dependencies: {
          gameReviewService,
          userService,
        },
        payload: {
          reviewId: "",
          userId: mockUser.id,
        },
      })
    ).rejects.toThrow(Error);
  });


  it("should throw error when userId is empty", async () => {
    await expect(
      deleteReview({
        dependencies: {
          gameReviewService,
          userService,
        },
        payload: {
          reviewId: mockReview.id,
          userId: "",
        },
      })
    ).rejects.toThrow(Error);
  });


  it("should throw error when user does not exist", async () => {
    userService.getById.mockResolvedValue(undefined);

    await expect(
      deleteReview({
        dependencies: {
          gameReviewService,
          userService,
        },
        payload: {
          reviewId: mockReview.id,
          userId: mockUser.id,
        },
      })
    ).rejects.toThrow(Error);
    expect(userService.getById).toHaveBeenCalledWith(mockUser.id);
    expect(userService.getById).toHaveBeenCalledOnce();
  });


  it("should throw error when review does not exist", async () => {
    userService.getById.mockResolvedValue(mockUser);
    gameReviewService.getById.mockResolvedValue(undefined);

    await expect(
      deleteReview({
        dependencies: {
          gameReviewService,
          userService,
        },
        payload: {
          reviewId: mockReview.id,
          userId: mockUser.id,
        },
      })
    ).rejects.toThrow(Error);
    expect(userService.getById).toHaveBeenCalledWith(mockUser.id);
    expect(gameReviewService.getById).toHaveBeenCalledWith(mockReview.id);
    expect(userService.getById).toHaveBeenCalledOnce();
    expect(gameReviewService.getById).toHaveBeenCalledOnce();
  });


  it("should throw error when user is not the review owner", async () => {
    const differentUser = createMockUser({ id: "different-user" });
    userService.getById.mockResolvedValue(differentUser);
    gameReviewService.getById.mockResolvedValue(mockReview);

    await expect(
      deleteReview({
        dependencies: {
          gameReviewService,
          userService,
        },
        payload: {
          reviewId: mockReview.id,
          userId: differentUser.id,
        },
      })
    ).rejects.toThrow("Unauthorized");
    expect(userService.getById).toHaveBeenCalledWith(differentUser.id);
    expect(gameReviewService.getById).toHaveBeenCalledWith(mockReview.id);
    expect(userService.getById).toHaveBeenCalledOnce();
    expect(gameReviewService.getById).toHaveBeenCalledOnce();
    expect(gameReviewService.delete).not.toHaveBeenCalled();
  });

  it("should delete review successfully", async () => {
    userService.getById.mockResolvedValue(mockUser);
    gameReviewService.getById.mockResolvedValue(mockReview);
    gameReviewService.delete.mockResolvedValue(true);

    const result = await deleteReview({
      dependencies: {
        gameReviewService,
        userService,
      },
      payload: {
        reviewId: mockReview.id,
        userId: mockUser.id,
      },
    });

    expect(result).toEqual(true);
    expect(userService.getById).toHaveBeenCalledWith(mockUser.id);
    expect(gameReviewService.getById).toHaveBeenCalledWith(mockReview.id);
    expect(gameReviewService.delete).toHaveBeenCalledWith(mockReview.id);
    expect(userService.getById).toHaveBeenCalledOnce();
    expect(gameReviewService.getById).toHaveBeenCalledOnce();
    expect(gameReviewService.delete).toHaveBeenCalledOnce();
  });
});
