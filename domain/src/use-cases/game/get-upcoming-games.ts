import { GameService } from "@/services";

interface GetUpcomingGamesParams {
  dependencies: {
    gameService: GameService;
  };
  payload: {
    limit?: number;
  };
}

export async function getUpcomingGames({
  dependencies,
  payload,
}: GetUpcomingGamesParams) {
  const result = await dependencies.gameService.getUpcomingGames(
    payload.limit || 10
  );
  return result;
}
