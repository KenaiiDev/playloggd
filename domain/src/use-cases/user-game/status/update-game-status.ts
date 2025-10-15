import { GameStatus } from "@/entities/user-game";
import { UserGameService } from "@/services";

interface UpdateGameStatusProps {
  dependencies: {
    userGameService: UserGameService;
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
  if (!payload.userId) return new Error("User id is required");
  if (!payload.gameExternalId) return new Error("Game id is required");
  if (!payload.status) return new Error("Game status is required");

  const result = await dependencies.userGameService.updateGameStatus(payload);

  return result;
}
