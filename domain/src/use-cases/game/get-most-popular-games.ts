import { GameService } from "@/services/";

interface GetMostPopularGamesParams {
  dependencies: {
    gameService: GameService;
  };
  payload: {
    limit?: number;
  };
}

export async function getMostPopularGames({
  dependencies,
  payload,
}: GetMostPopularGamesParams) {
  const result = await dependencies.gameService.getMostPopularGames(
    payload.limit || 10
  );
  return result;
}
