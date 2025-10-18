import { GameStatus, GameEntry } from "@/entities/game-entry";

export interface GameEntryService {
  findUserGame: (
    userId: string,
    gameId: string
  ) => Promise<GameEntry | undefined>;
  addUserGame: (
    data: Omit<GameEntry, "id" | "createdAt" | "updatedAt">
  ) => Promise<GameEntry>;
  removeUserGame: (userId: string, gameId: string) => Promise<undefined>;
  getUserGames: (userId: string) => Promise<GameEntry[]>;
  updateGameStatus: ({
    userId,
    gameExternalId,
    status,
  }: {
    userId: string;
    gameExternalId: string;
    status: GameStatus;
  }) => Promise<GameEntry>;
}
