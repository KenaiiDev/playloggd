import { NotFoundError, ValidationError } from "@/errors";
import { GameEntryService } from "@/services";

interface RemoveFromCollectionParams {
  dependencies: {
    userGameService: GameEntryService;
  };
  payload: {
    userId: string;
    gameExternalId: string;
  };
}

export async function removeFromCollection({
  dependencies,
  payload,
}: RemoveFromCollectionParams) {
  if (!payload.userId) throw new ValidationError("User id is required");
  if (!payload.gameExternalId) throw new ValidationError("Game id is required");

  const dataFound = await dependencies.userGameService.findUserGame(
    payload.userId,
    payload.gameExternalId
  );
  if (!dataFound) throw new NotFoundError("No data found");

  const result = await dependencies.userGameService.removeUserGame(
    payload.userId,
    payload.gameExternalId
  );

  return result;
}
