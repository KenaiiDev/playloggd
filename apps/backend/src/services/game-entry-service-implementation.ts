import { GameEntry, GameEntryService, GameStatus } from "@playloggd/domain";
import { PrismaClient, GameStatus as PrismaGameStatus } from "@prisma/client";

export class GameEntryServiceImplementation implements GameEntryService {
  private db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  private mapPrismaStatusToDomain(status: PrismaGameStatus): GameStatus {
    return status.toLowerCase() as GameStatus;
  }

  private mapDomainStatusToPrisma(status: GameStatus): PrismaGameStatus {
    return status.toUpperCase() as PrismaGameStatus;
  }

  async findGameEntry(
    userId: string,
    gameId: string
  ): Promise<GameEntry | undefined> {
    const result = await this.db.gameEntry.findUnique({
      where: {
        userId_gameExternalId: {
          userId,
          gameExternalId: gameId,
        },
      },
    });
    if (!result) return;
    return { ...result, status: this.mapPrismaStatusToDomain(result.status) };
  }

  async addGameEntry(
    data: Omit<GameEntry, "id" | "createdAt" | "updatedAt">
  ): Promise<GameEntry> {
    const gameEntry = await this.db.gameEntry.create({
      data: {
        userId: data.userId,
        gameExternalId: data.gameExternalId,
        status: this.mapDomainStatusToPrisma(data.status),
      },
    });

    return {
      ...gameEntry,
      status: this.mapPrismaStatusToDomain(gameEntry.status),
    };
  }

  async removeGameEntry(userId: string, gameId: string): Promise<undefined> {
    await this.db.gameEntry.delete({
      where: {
        userId_gameExternalId: {
          userId,
          gameExternalId: gameId,
        },
      },
    });
    return;
  }

  async getUserGameEntries(userId: string): Promise<GameEntry[]> {
    const entries = await this.db.gameEntry.findMany({
      where: {
        userId,
      },
    });
    const result: GameEntry[] = entries.map((item) => {
      const mappedStatus = this.mapPrismaStatusToDomain(item.status);
      return { ...item, status: mappedStatus };
    });

    return result;
  }

  async updateGameStatus(
    data: Omit<GameEntry, "id" | "createdAt" | "updatedAt">
  ): Promise<GameEntry> {
    const updatedEntry = await this.db.gameEntry.update({
      where: {
        userId_gameExternalId: {
          userId: data.userId,
          gameExternalId: data.gameExternalId,
        },
      },
      data: {
        status: this.mapDomainStatusToPrisma(data.status),
      },
    });

    return {
      ...updatedEntry,
      status: this.mapPrismaStatusToDomain(updatedEntry.status),
    };
  }
}
