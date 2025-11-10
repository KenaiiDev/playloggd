import { Game, GameFilter } from "@playloggd/domain";
import { IGDBApiAdapter } from "./igdb-api-adapter";
import { IGDBApiClient } from "./igdb-api-client";
import type { IGDBGameResponse } from "./types/igdb-types";

export class IGDBApiAdapterImplementation implements IGDBApiAdapter {
  private readonly DEFAULT_FIELDS = [
    "id",
    "name",
    "summary",
    "first_release_date",
    "involved_companies.developer",
    "involved_companies.publisher",
    "involved_companies.company.name",
    "cover.url",
    "genres.name",
    "platforms.name",
    "rating",
    "rating_count",
    "created_at",
    "updated_at",
  ].join(",");

  constructor(private readonly client: IGDBApiClient) {}

  private mapIGDBGameToGame(igdbGame: IGDBGameResponse): Game {
    const developer = igdbGame.involved_companies?.find(
      (company) => company.developer
    )?.company.name;

    const publisher = igdbGame.involved_companies?.find(
      (company) => company.publisher
    )?.company.name;

    let coverUrl = igdbGame.cover?.url;
    if (coverUrl && !coverUrl.startsWith("http")) {
      coverUrl = `https:${coverUrl}`.replace("t_thumb", "t_cover_big");
    }

    return {
      externalId: igdbGame.id.toString(),
      title: igdbGame.name,
      description: igdbGame.summary,
      releaseDate: igdbGame.first_release_date
        ? new Date(igdbGame.first_release_date * 1000)
        : undefined,
      developer,
      publisher,
      coverUrl,
      genres: igdbGame.genres?.map((g) => g.name) || [],
      platforms: igdbGame.platforms?.map((p) => p.name) || [],
      rating: Math.round(igdbGame.rating || 0),
      createdAt: new Date(igdbGame.created_at * 1000),
      updatedAt: new Date(igdbGame.updated_at * 1000),
    };
  }

  async searchGames(query: string): Promise<Game[]> {
    const response = await this.client.post<IGDBGameResponse[]>(
      "games",
      IGDBApiClient.buildQuery({
        fields: [this.DEFAULT_FIELDS],
        where: [`name ~ *"${query}"*`],
        limit: 10,
      })
    );
    return response.data.map((game) => this.mapIGDBGameToGame(game));
  }

  async getGameById(id: string): Promise<Game | undefined> {
    const response = await this.client.post<IGDBGameResponse[]>(
      "/games",
      IGDBApiClient.buildQuery({
        fields: [this.DEFAULT_FIELDS],
        where: [`id = ${id}`],
        limit: 1,
      })
    );
    return response.data[0]
      ? this.mapIGDBGameToGame(response.data[0])
      : undefined;
  }

  async getTopRatedGames(limit: number): Promise<Game[]> {
    const response = await this.client.post<IGDBGameResponse[]>(
      "/games",
      IGDBApiClient.buildQuery({
        fields: [this.DEFAULT_FIELDS],
        where: ["rating != null", "rating_count > 20"], // Aseguramos que tenga suficientes votos
        sort: "rating desc",
        limit,
      })
    );
    return response.data.map((game) => this.mapIGDBGameToGame(game));
  }

  async getUpcomingGames(limit: number): Promise<Game[]> {
    const now = Math.floor(Date.now() / 1000);
    const response = await this.client.post<IGDBGameResponse[]>(
      "/games",
      IGDBApiClient.buildQuery({
        fields: [this.DEFAULT_FIELDS],
        where: [`first_release_date > ${now}`],
        sort: "first_release_date asc",
        limit,
      })
    );
    return response.data.map((game) => this.mapIGDBGameToGame(game));
  }

  async getRecentReleaseGames(limit: number): Promise<Game[]> {
    const now = Math.floor(Date.now() / 1000);
    const threeMonthsAgo = now - 90 * 24 * 60 * 60;

    const response = await this.client.post<IGDBGameResponse[]>(
      "/games",
      IGDBApiClient.buildQuery({
        fields: [this.DEFAULT_FIELDS],
        where: [
          `first_release_date <= ${now}`,
          `first_release_date >= ${threeMonthsAgo}`,
        ],
        sort: "first_release_date desc",
        limit,
      })
    );
    return response.data.map((game) => this.mapIGDBGameToGame(game));
  }

  async getMostPopularGames(limit: number): Promise<Game[]> {
    const response = await this.client.post<IGDBGameResponse[]>(
      "/games",
      IGDBApiClient.buildQuery({
        fields: [this.DEFAULT_FIELDS],
        where: ["rating_count != null"],
        sort: "rating_count desc",
        limit,
      })
    );
    return response.data.map((game) => this.mapIGDBGameToGame(game));
  }

  async getGamesByFilter(filter: GameFilter): Promise<Game[]> {
    const conditions: string[] = [];

    if (filter.title) {
      conditions.push(`name ~ *"${filter.title}"*`);
    }
    if (filter.minRating) {
      conditions.push(`rating >= ${filter.minRating}`);
    }
    if (filter.fromDate) {
      conditions.push(
        `first_release_date >= ${Math.floor(filter.fromDate.getTime() / 1000)}`
      );
    }
    if (filter.toDate) {
      conditions.push(
        `first_release_date <= ${Math.floor(filter.toDate.getTime() / 1000)}`
      );
    }

    const response = await this.client.post<IGDBGameResponse[]>(
      "/games",
      IGDBApiClient.buildQuery({
        fields: [this.DEFAULT_FIELDS],
        where: conditions,
        limit: 50,
      })
    );
    return response.data.map((game) => this.mapIGDBGameToGame(game));
  }
}
