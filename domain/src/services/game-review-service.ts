import { GameReview } from "@/entities";

export interface GameReviewService {
  getUserGameReview: (
    userId: string,
    gameId: string
  ) => Promise<GameReview | undefined>;
  create: (
    data: Omit<GameReview, "id" | "createdAt" | "updatedAt">
  ) => Promise<GameReview>;
}
