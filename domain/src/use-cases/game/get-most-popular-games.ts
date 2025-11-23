import { GameService } from "@/services/";
import { PaginationParams } from "@/utils";

interface GetMostPopularGamesParams {
  dependencies: {
    gameService: GameService;
  };
  payload: {
    pagination?: PaginationParams;
  };
}

export async function getMostPopularGames({
  dependencies,
  payload,
}: GetMostPopularGamesParams) {
  const result = await dependencies.gameService.getMostPopularGames(
    payload.pagination
  );
  return result;
}
