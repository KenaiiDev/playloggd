import { UserGameService } from "@/services";

interface RemoveFromCollectionParams {
  dependencies: {
    userGameService: UserGameService;
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
  if (!payload.userId) return new Error("User id is required");
  if (!payload.gameExternalId) return new Error("Game id is required");

  const dataFound = await dependencies.userGameService.findUserGame(
    payload.userId,
    payload.gameExternalId
  );
  if (!dataFound) return new Error("No data found");

  const result = await dependencies.userGameService.removeUserGame(
    payload.userId,
    payload.gameExternalId
  );

  return result;
}
