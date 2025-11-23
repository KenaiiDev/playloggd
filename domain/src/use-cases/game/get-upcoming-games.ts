import { GameService } from "@/services";
import { PaginationParams } from "@/utils";

interface GetUpcomingGamesParams {
  dependencies: {
    gameService: GameService;
  };
  payload: {
    pagination?: PaginationParams;
  };
}

export async function getUpcomingGames({
  dependencies,
  payload,
}: GetUpcomingGamesParams) {
  const result = await dependencies.gameService.getUpcomingGames(
    payload.pagination
  );
  return result;
}
