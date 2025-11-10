import { Game, GameFilter } from "@playloggd/domain";

export interface IGDBApiAdapter {
  searchGames(query: string): Promise<Game[]>;
  getGameById(id: string): Promise<Game | undefined>;
  getGamesByFilter(filter: GameFilter): Promise<Game[]>;

  getMostPopularGames(limit: number): Promise<Game[]>;
  getTopRatedGames(limit: number): Promise<Game[]>;
  getUpcomingGames(limit: number): Promise<Game[]>;
  getRecentReleaseGames(limit: number): Promise<Game[]>;
}
