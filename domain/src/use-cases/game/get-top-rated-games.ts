import { GameService } from "@/services";
import { PaginationParams } from "@/utils";

interface GetTopRatedGamesParams {
  dependencies: {
    gameService: GameService;
  };
  payload: {
    pagination?: PaginationParams;
  };
}

export async function getTopRatedGames({
  dependencies,
  payload,
}: GetTopRatedGamesParams) {
  const result = await dependencies.gameService.getTopRatedGames(
    payload.pagination
  );
  return result;
}
