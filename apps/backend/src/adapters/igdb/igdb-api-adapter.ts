import {
  Game,
  GameFilter,
  PaginatedResponse,
  PaginationParams,
} from "@playloggd/domain";

export interface IGDBApiAdapter {
  searchGames(
    query: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Game>>;
  getGameById(id: string): Promise<Game | undefined>;
  getGamesByFilter(
    filter: GameFilter,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Game>>;

  getMostPopularGames(
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Game>>;
  getTopRatedGames(
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Game>>;
  getUpcomingGames(
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Game>>;
  getRecentReleaseGames(
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Game>>;
}
