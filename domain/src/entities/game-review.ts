import { BaseEntity } from "@/utils";

export interface GameReview extends BaseEntity {
  userId: string;
  gameExternalId: string;
  rating: number;
  content: string;
  hoursPlayed?: number;
  playedAt?: Date;
}
