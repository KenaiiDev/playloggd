import { GameService } from "@/services";

interface GetRecentReleaseGamesParams {
  dependencies: {
    gameService: GameService;
  };
  payload: {
    limit?: number;
  };
}

export async function getRecentReleaseGames({
  dependencies,
  payload,
}: GetRecentReleaseGamesParams) {
  const result = await dependencies.gameService.getRecentReleaseGames(
    payload.limit || 10
  );
  return result;
}
