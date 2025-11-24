import type { Game } from "@playloggd/domain";

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
