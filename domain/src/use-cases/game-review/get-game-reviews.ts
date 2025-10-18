import { GameReviewService, GameService } from "@/services";

interface GetGameReviewsProps {
  dependencies: {
    gameReviewService: GameReviewService;
    gameService: GameService;
  };
  payload: {
    gameId: string;
  };
}

export async function getGameReviews({
  dependencies,
  payload,
}: GetGameReviewsProps) {
  if (!payload.gameId) return new Error("Game id is required");

  const gameFound = await dependencies.gameService.getGameById(payload.gameId);
  if (!gameFound) return new Error("No game found");

  const result = await dependencies.gameReviewService.getGameReviews(
    payload.gameId
  );
  return result;
}
