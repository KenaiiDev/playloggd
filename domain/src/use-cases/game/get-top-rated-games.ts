import { GameService } from "@/services";

interface GetTopRatedGamesParams {
  dependencies: {
    gameService: GameService;
  };
  payload: {
    limit?: number;
  };
}

export async function getTopRatedGames({
  dependencies,
  payload,
}: GetTopRatedGamesParams) {
  const result = await dependencies.gameService.getTopRatedGames(
    payload.limit || 10
  );
  return result;
}
