import { NotFoundError, ValidationError } from "@/errors";
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
  if (!payload.gameId) throw new ValidationError("Game id is required!");

  const result = await dependencies.gameService.getGameById(payload.gameId);

  if (result === undefined) throw new NotFoundError("No game was found");

  return result;
}
