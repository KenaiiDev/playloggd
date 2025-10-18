import { GameReviewService, UserService } from "@/services";

interface DeleteReviewProps {
  dependencies: {
    gameReviewService: GameReviewService;
    userService: UserService;
  };
  payload: {
    reviewId: string;
    userId: string;
  };
}

export async function deleteReview({
  dependencies,
  payload,
}: DeleteReviewProps): Promise<Error | boolean> {
  if (!payload.reviewId) return new Error("Review id is required");
  if (!payload.userId) return new Error("User id is required");

  const userFound = await dependencies.userService.getById(payload.userId);
  if (!userFound) return new Error("No user found");

  const reviewFound = await dependencies.gameReviewService.getById(
    payload.reviewId
  );
  if (!reviewFound) return new Error("No review found");

  if (reviewFound.userId !== userFound.id) return new Error("Unauthorized");

  const result = await dependencies.gameReviewService.delete(payload.reviewId);

  return result;
}
