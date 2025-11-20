import { GameReview, GameReviewService } from "@playloggd/domain";
import { PrismaClient, GameReview as PrismaGameReview } from "@prisma/client";

export class GameReviewServiceImplementation implements GameReviewService {
  private db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  private mapPrismaReviewToDomain(gameReview: PrismaGameReview): GameReview {
    return {
      ...gameReview,
      hoursPlayed: gameReview.hoursPlayed || undefined,
      playedAt: gameReview.playedAt || undefined,
    };
  }

  async getUserGameReview(
    userId: string,
    gameId: string
  ): Promise<GameReview | undefined> {
    const result = await this.db.gameReview.findUnique({
      where: {
        userId_gameExternalId: {
          gameExternalId: gameId,
          userId,
        },
      },
    });

    if (!result) return;

    return this.mapPrismaReviewToDomain(result);
  }

  async create(
    data: Omit<GameReview, "id" | "createdAt" | "updatedAt">
  ): Promise<GameReview> {
    const gameReview = await this.db.gameReview.create({
      data,
    });

    return this.mapPrismaReviewToDomain(gameReview);
  }

  async getById(id: string): Promise<GameReview | undefined> {
    const result = await this.db.gameReview.findUnique({
      where: {
        id,
      },
    });

    if (!result) return;

    return this.mapPrismaReviewToDomain(result);
  }

  async update({
    id,
    data,
  }: {
    id: string;
    data: Partial<
      Omit<
        GameReview,
        "id" | "createdAt" | "updatedAt" | "userId" | "gameExternalId"
      >
    >;
  }): Promise<GameReview> {
    const updatedReview = await this.db.gameReview.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });

    return this.mapPrismaReviewToDomain(updatedReview);
  }

  async delete(reviewId: string): Promise<boolean> {
    const result = await this.db.gameReview.delete({
      where: {
        id: reviewId,
      },
    });

    if (result) return true;
    return false;
  }

  async getGameReviews(gameId: string): Promise<GameReview[]> {
    const result = await this.db.gameReview.findMany({
      where: {
        gameExternalId: gameId,
      },
    });

    return result.map((review) => this.mapPrismaReviewToDomain(review));
  }

  async getUserReviews(userId: string): Promise<GameReview[]> {
    const result = await this.db.gameReview.findMany({
      where: {
        userId,
      },
    });

    return result.map((review) => this.mapPrismaReviewToDomain(review));
  }
}
