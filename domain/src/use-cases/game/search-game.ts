import { ValidationError } from "@/errors";
import { GameService } from "@/services/";
import { PaginationParams } from "@/utils";

interface SearchGameParams {
  dependencies: {
    gameService: GameService;
  };
  payload: {
    query: string;
    pagination?: PaginationParams;
  };
}

export async function searchGame({ dependencies, payload }: SearchGameParams) {
  if (!payload.query) throw new ValidationError("Search query cannot be empty");
  if (payload.query.length <= 2)
    throw new ValidationError(
      "Search query must be at least 2 characters long"
    );

  const result = await dependencies.gameService.searchGames(
    payload.query,
    payload.pagination
  );

  return result;
}
