import { UserGameService } from "@/services";
import { GameStatus } from "@/entities/user-game";

interface AddToCollectionParams {
  dependencies: {
    userGameService: UserGameService;
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
  if (!payload.userId) return new Error("User id is required");
  if (!payload.gameExternalId) return new Error("Game id is required");

  const dataFound = await dependencies.userGameService.findUserGame(
    payload.userId,
    payload.gameExternalId
  );
  if (dataFound) return new Error("Game already has been added to this user");

  const result = await dependencies.userGameService.addUserGame(payload);

  return result;
}
