import type { Game } from "@/entities";
import type { PaginatedResponse, PaginationParams } from "@/utils";

export interface GameFilter {
  title?: string;
  developer?: string;
  publisher?: string;
  genres?: string[];
  platforms?: string[];
  fromDate?: Date;
  toDate?: Date;
  minRating?: number;
}
export interface GameService {
  searchGames: (
    query: string,
    pagination?: PaginationParams
  ) => Promise<PaginatedResponse<Game>>;
  getGameById: (id: string) => Promise<Game | undefined>;
  getByFilter: (
    filter: GameFilter,
    pagination?: PaginationParams
  ) => Promise<PaginatedResponse<Game>>;
  getMostPopularGames: (
    pagination?: PaginationParams
  ) => Promise<PaginatedResponse<Game>>;
  getTopRatedGames: (
    pagination?: PaginationParams
  ) => Promise<PaginatedResponse<Game>>;
  getUpcomingGames: (
    pagination?: PaginationParams
  ) => Promise<PaginatedResponse<Game>>;
  getRecentReleaseGames: (
    pagination?: PaginationParams
  ) => Promise<PaginatedResponse<Game>>;
}
