import { GameStatus, GameEntry } from "@/entities/game-entry";

export interface GameEntryService {
  findGameEntry: (
    userId: string,
    gameId: string
  ) => Promise<GameEntry | undefined>;
  addGameEntry: (
    data: Omit<GameEntry, "id" | "createdAt" | "updatedAt">
  ) => Promise<GameEntry>;
  removeGameEntry: (userId: string, gameId: string) => Promise<undefined>;
  getUserGameEntries: (userId: string) => Promise<GameEntry[]>;
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
