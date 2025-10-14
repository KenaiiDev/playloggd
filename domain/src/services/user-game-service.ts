import { UserGame } from "@/entities/user-game";

export interface UserGameService {
  findUserGame: (
    userId: string,
    gameId: string
  ) => Promise<UserGame | undefined>;
  addUserGame: (
    data: Omit<UserGame, "id" | "createdAt" | "updatedAt">
  ) => Promise<UserGame>;
  removeUserGame: (userId: string, gameId: string) => Promise<undefined>;
}
