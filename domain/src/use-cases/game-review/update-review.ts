import { NotFoundError, ValidationError } from "@/errors";
import { GameReviewService, GameService, UserService } from "@/services";

interface UpdateReviewProps {
  dependencies: {
    gameReviewService: GameReviewService;
    gameService: GameService;
    userService: UserService;
  };
  payload: {
    reviewId: string;
    rating?: number;
    content?: string;
    hoursPlayed?: number;
    playedAt?: Date;
  };
}

export async function updateReview({
  dependencies,
  payload,
}: UpdateReviewProps) {
  const { reviewId, ...data } = payload;
  if (!reviewId) throw new ValidationError("Review id is required");

  if (data.rating) {
    if (data.rating < 0 || data.rating > 5)
      throw new ValidationError("Rating must be between 0 and 5");
  }

  const reviewFound = await dependencies.gameReviewService.getById(reviewId);
  if (!reviewFound) throw new NotFoundError("No review found");

  const result = await dependencies.gameReviewService.update({
    id: reviewId,
    data,
  });

  return result;
}
