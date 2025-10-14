import { GameService } from "@/services/";

interface GetGameDetailsParams {
  dependencies: {
    gameService: GameService;
  };
  payload: {
    gameId: string;
  };
}

export async function getGameDetails({
  dependencies,
  payload,
}: GetGameDetailsParams) {
  if (!payload.gameId) return new Error("Game id is required!");

  const result = await dependencies.gameService.getGameById(payload.gameId);

  if (result === undefined) return new Error("No game was found");

  return result;
}
