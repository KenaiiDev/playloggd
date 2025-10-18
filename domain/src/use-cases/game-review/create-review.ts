import { GameReviewService, GameService, UserService } from "@/services/";

interface CreateReviewProps {
  dependencies: {
    gameReviewService: GameReviewService;
    userService?: UserService;
    gameService?: GameService;
  };
  payload: {
    userId: string;
    gameExternalId: string;
    rating: number;
    content: string;
    hoursPlayed?: number;
    playedAt?: Date;
  };
}

export async function createReview({
  dependencies,
  payload,
}: CreateReviewProps) {
  if (!payload.userId) return new Error("User id is required");
  if (!payload.gameExternalId) return new Error("Game id is required");
  if (payload.rating < 0 || payload.rating > 5)
    return new Error("Rating must be between 0 and 5");

  const userFound = await dependencies?.userService?.getById(payload.userId);
  if (!userFound) return new Error("No user found");

  const gameFound = await dependencies?.gameService?.getGameById(
    payload.gameExternalId
  );
  if (!gameFound) return new Error("No game found");

  const review = await dependencies.gameReviewService.getUserGameReview(
    payload.userId,
    payload.gameExternalId
  );
  if (review) return new Error("This player already reviewed this game");

  const result = await dependencies.gameReviewService.create(payload);
  return result;
}
