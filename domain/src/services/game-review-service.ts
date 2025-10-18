import { GameReview } from "@/entities";

export interface GameReviewService {
  getUserGameReview: (
    userId: string,
    gameId: string
  ) => Promise<GameReview | undefined>;
  create: (
    data: Omit<GameReview, "id" | "createdAt" | "updatedAt">
  ) => Promise<GameReview>;
  getById: (id: string) => Promise<GameReview | undefined>;
  update: ({
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
  }) => Promise<GameReview>;
  delete: (reviewId: string) => Promise<boolean>;
  getGameReviews: (gameId: string) => Promise<GameReview[]>;
  getUserReviews: (userId: string) => Promise<GameReview[]>;
}
