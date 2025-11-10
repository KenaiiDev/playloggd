import { IGDBApiAdapter } from "@/adapters/igdb/igdb-api-adapter";
import { Game, GameFilter, GameService } from "@playloggd/domain";

export class GameServiceImplementation implements GameService {
  constructor(private readonly igdbAdapter: IGDBApiAdapter) {}

  async searchGames(query: string): Promise<Game[]> {
    const result = await this.igdbAdapter.searchGames(query);
    return result;
  }

  async getGameById(id: string): Promise<Game | undefined> {
    const result = await this.igdbAdapter.getGameById(id);
    return result;
  }

  async getByFilter(filter: GameFilter): Promise<Game[]> {
    const result = await this.igdbAdapter.getGamesByFilter(filter);
    return result;
  }

  async getMostPopularGames(limit: number): Promise<Game[]> {
    const result = await this.igdbAdapter.getMostPopularGames(limit);
    return result;
  }

  async getTopRatedGames(limit: number): Promise<Game[]> {
    const result = await this.igdbAdapter.getTopRatedGames(limit);
    return result;
  }

  async getUpcomingGames(limit: number): Promise<Game[]> {
    const result = await this.igdbAdapter.getUpcomingGames(limit);
    return result;
  }

  async getRecentReleaseGames(limit: number): Promise<Game[]> {
    const result = await this.igdbAdapter.getRecentReleaseGames(limit);
    return result;
  }
}
