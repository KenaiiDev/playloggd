import type { BaseEntity } from "@/utils/types";

export interface UserGame extends BaseEntity {
  userId: string;
  gameExternalId: string;
  status: GameStatus;
}

export const GameStatusEnum = {
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

export type GameStatus = (typeof GameStatusEnum)[keyof typeof GameStatusEnum];
