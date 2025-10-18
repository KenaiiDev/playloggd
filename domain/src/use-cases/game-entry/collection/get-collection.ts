import { GameStatus } from "@/entities/game-entry";
import { GameService, GameEntryService } from "@/services";

interface GetCollectionParams {
  dependencies: {
    userGameService: GameEntryService;
    gameService?: GameService;
  };
  payload: {
    userId: string;
    status?: GameStatus;
  };
}

export async function getCollection({
  dependencies,
  payload,
}: GetCollectionParams) {
  if (!payload.userId) return new Error("User id is required");

  const userGameResult = await dependencies.userGameService.getUserGames(
    payload.userId
  );

  try {
    const filteredGames = payload.status
      ? userGameResult.filter((game) => game.status === payload.status)
      : userGameResult;

    if (!dependencies.gameService) {
      return filteredGames;
    }

    const gamesWithDetails = await Promise.all(
      filteredGames.map(async (userGame) => {
        const game = await dependencies.gameService?.getGameById(
          userGame.gameExternalId
        );
        return {
          ...userGame,
          game: {
            title: game?.title,
            coverUrl: game?.coverUrl,
            externalId: game?.externalId,
          },
        };
      })
    );

    return gamesWithDetails;
  } catch (error) {
    return error instanceof Error
      ? error
      : new Error("An error has occurred, try again later");
  }
}
