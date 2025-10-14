import type { BaseEntity } from "@/utils/types";

type GameBaseEntity = Omit<BaseEntity, "id">;

export interface Game extends GameBaseEntity {
  externalId: string;
  title: string;
  description?: string;
  releaseDate?: Date;
  developer?: string;
  publisher?: string;
  coverUrl?: string;
  genres: string[];
  platforms?: string;
  rating: number;
}
