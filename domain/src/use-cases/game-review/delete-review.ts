import { NotFoundError, UnauthorizedError, ValidationError } from "@/errors";
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
  if (!payload.reviewId) throw new ValidationError("Review id is required");
  if (!payload.userId) throw new ValidationError("User id is required");

  const userFound = await dependencies.userService.getById(payload.userId);
  if (!userFound) throw new NotFoundError("No user found");

  const reviewFound = await dependencies.gameReviewService.getById(
    payload.reviewId
  );
  if (!reviewFound) throw new NotFoundError("No review found");

  if (reviewFound.userId !== userFound.id)
    throw new UnauthorizedError("Unauthorized");

  const result = await dependencies.gameReviewService.delete(payload.reviewId);

  return result;
}
