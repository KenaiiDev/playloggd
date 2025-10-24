import { GameStatus } from "@/entities/game-entry";
import { ValidationError } from "@/errors";
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
  if (!payload.userId) throw new ValidationError("User id is required");

  const userGameResult = await dependencies.userGameService.getUserGames(
    payload.userId
  );

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
}
