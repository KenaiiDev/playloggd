import { GameService } from "@/services";
import { PaginationParams } from "@/utils";

interface GetRecentReleaseGamesParams {
  dependencies: {
    gameService: GameService;
  };
  payload: {
    pagination?: PaginationParams;
  };
}

export async function getRecentReleaseGames({
  dependencies,
  payload,
}: GetRecentReleaseGamesParams) {
  const result = await dependencies.gameService.getRecentReleaseGames(
    payload.pagination
  );
  return result;
}
