import type { Game } from "@/entities";

export interface GameFilter {
  title?: string;
  developer?: string;
  publisher?: string;
  genres?: string[];
  platforms?: string;
  fromDate?: Date;
  toDate?: Date;
  minRating?: number;
}
export interface GameService {
  searchGames: (query: string) => Promise<Game[]>;
  getGameById: (id: string) => Promise<Game | undefined>;
  getByFilter: (filter: GameFilter) => Promise<Game[]>;
  getMostPopularGames: (limit: number) => Promise<Game[]>;
  getTopRatedGames: (limit: number) => Promise<Game[]>;
  getUpcomingGames: (limit: number) => Promise<Game[]>;
  getRecentReleaseGames: (limit: number) => Promise<Game[]>;
}
