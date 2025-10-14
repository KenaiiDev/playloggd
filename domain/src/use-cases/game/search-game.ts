import { GameService } from "@/services/";

interface SearchGameParams {
  dependencies: {
    gameService: GameService;
  };
  payload: {
    query: string;
  };
}

export async function searchGame({ dependencies, payload }: SearchGameParams) {
  if (!payload.query) return new Error("Search query cannot be empty");
  if (payload.query.length <= 2)
    return new Error("Search query must be at least 2 characters long");
  const result = await dependencies.gameService.searchGames(payload.query);

  return result;
}
