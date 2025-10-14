import type { Game } from "@/entities";

export interface GameService {
  searchGames: (query: string) => Promise<Game[]>;
  getGameById: (id: string) => Promise<Game | undefined>;
}
