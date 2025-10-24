import { GameStatus } from "@/entities/game-entry";
import { ValidationError } from "@/errors";
import { GameEntryService } from "@/services";

interface UpdateGameStatusProps {
  dependencies: {
    userGameService: GameEntryService;
  };
  payload: {
    userId: string;
    gameExternalId: string;
    status: GameStatus;
  };
}

export async function updateGameStatus({
  dependencies,
  payload,
}: UpdateGameStatusProps) {
  if (!payload.userId) throw new ValidationError("User id is required");
  if (!payload.gameExternalId) throw new ValidationError("Game id is required");
  if (!payload.status) throw new ValidationError("Game status is required");

  const result = await dependencies.userGameService.updateGameStatus(payload);

  return result;
}
