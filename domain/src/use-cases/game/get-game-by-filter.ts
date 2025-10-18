import { GameService, GameFilter } from "@/services";

interface GetGameByFilterProps {
  dependencies: {
    gameService: GameService;
  };
  payload: {
    filter: GameFilter;
  };
}

export async function getGameByFilter({
  dependencies,
  payload,
}: GetGameByFilterProps) {
  const result = await dependencies.gameService.getByFilter(payload.filter);
  return result;
}
