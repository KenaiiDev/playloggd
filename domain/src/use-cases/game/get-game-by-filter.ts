import { GameService, GameFilter } from "@/services";
import { PaginationParams } from "@/utils";

interface GetGameByFilterProps {
  dependencies: {
    gameService: GameService;
  };
  payload: {
    filter: GameFilter;
    pagination?: PaginationParams;
  };
}

export async function getGameByFilter({
  dependencies,
  payload,
}: GetGameByFilterProps) {
  const result = await dependencies.gameService.getByFilter(
    payload.filter,
    payload.pagination
  );
  return result;
}
