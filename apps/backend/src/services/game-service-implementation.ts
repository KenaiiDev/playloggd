import { IGDBApiAdapter } from "@/adapters/igdb/igdb-api-adapter";
import {
  Game,
  GameFilter,
  GameService,
  PaginatedResponse,
  PaginationParams,
} from "@playloggd/domain";

export class GameServiceImplementation implements GameService {
  constructor(private readonly igdbAdapter: IGDBApiAdapter) {}

  async searchGames(
    query: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Game>> {
    console.log({ pagination });
    const result = await this.igdbAdapter.searchGames(query, pagination);
    return result;
  }

  async getGameById(id: string): Promise<Game | undefined> {
    const result = await this.igdbAdapter.getGameById(id);
    return result;
  }

  async getByFilter(
    filter: GameFilter,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Game>> {
    const result = await this.igdbAdapter.getGamesByFilter(filter, pagination);
    return result;
  }

  async getMostPopularGames(
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Game>> {
    const result = await this.igdbAdapter.getMostPopularGames(pagination);
    return result;
  }

  async getTopRatedGames(
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Game>> {
    const result = await this.igdbAdapter.getTopRatedGames(pagination);
    return result;
  }

  async getUpcomingGames(
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Game>> {
    const result = await this.igdbAdapter.getUpcomingGames(pagination);
    return result;
  }

  async getRecentReleaseGames(
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Game>> {
    const result = await this.igdbAdapter.getRecentReleaseGames(pagination);
    return result;
  }
}
