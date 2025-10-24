import { GameEntryService } from "@/services";
import { GameStatus } from "@/entities/game-entry";
import { ConflictError, ValidationError } from "@/errors";

interface AddToCollectionParams {
  dependencies: {
    userGameService: GameEntryService;
  };
  payload: {
    userId: string;
    gameExternalId: string;
    status: GameStatus;
  };
}

export async function addToCollection({
  dependencies,
  payload,
}: AddToCollectionParams) {
  if (!payload.userId) throw new ValidationError("User id is required");
  if (!payload.gameExternalId) throw new ValidationError("Game id is required");

  const dataFound = await dependencies.userGameService.findUserGame(
    payload.userId,
    payload.gameExternalId
  );
  if (dataFound)
    throw new ConflictError("Game already has been added to this user");

  const result = await dependencies.userGameService.addUserGame(payload);

  return result;
}
