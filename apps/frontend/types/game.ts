import { BaseEntity } from "./shared";

export const GAME_STATUS = {
  // Planning status
  WISHLIST: "wishlist",
  BACKLOG: "backlog",

  // Active status
  PLAYING: "playing",
  ON_HOLD: "on_hold",

  // Finished status
  COMPLETED: "completed",
  FULLY_COMPLETED: "fully_completed",

  // Abandoned status
  DROPPED: "dropped",
  NOT_FOR_ME: "not_for_me",

  // Special status
  REPLAY: "replay",
  REVIEWING: "reviewing",
} as const;

export type GameStatusEnum = (typeof GAME_STATUS)[keyof typeof GAME_STATUS];

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
  platforms?: string[];
  rating: number;
}
