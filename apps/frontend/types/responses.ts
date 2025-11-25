import type { Game, GameEntry } from "@playloggd/domain";
import type { User } from "@playloggd/domain";

export interface ApiSuccessResponse<T> {
  status: number;
  statusMsg: string;
  data: T;
  pagination?: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export type GamesApiResponse = ApiSuccessResponse<Game[]> & {
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
};

export type GameApiResponse = ApiSuccessResponse<Game>;

export type UserResponse = Omit<
  User,
  "passwordHash" | "createdAt" | "updatedAt"
> & {
  createdAt: string;
  updatedAt: string;
};

export type UserApiResponse = ApiSuccessResponse<UserResponse>;

export type GameEntryApiResponse = ApiSuccessResponse<GameEntry>;

export type GameEntriesApiResponse = ApiSuccessResponse<GameEntry[]>;

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
  tokenType: string;
  expiresIn: number;
}

export type LoginApiResponse = ApiSuccessResponse<TokenResponse>;
