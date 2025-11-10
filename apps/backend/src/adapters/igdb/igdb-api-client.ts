import { TokenManager } from "@/utils/token-manager";
import axios, { AxiosInstance, AxiosResponse, isAxiosError } from "axios";

export interface IGDBApiClientConfig {
  clientId: string;
  tokenManager: TokenManager;
  baseURL?: string;
}

interface IGDBQueryOptions {
  fields?: string[];
  where?: string[];
  sort?: string;
  limit?: number;
  offset?: number;
}

export class IGDBApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = "IGDBApiError";
  }
}

export class IGDBApiClient {
  private readonly axiosInstance: AxiosInstance;
  private readonly baseURL: string = "https://api.igdb.com/v4";

  constructor(private readonly config: IGDBApiClientConfig) {
    this.axiosInstance = axios.create({
      baseURL: config.baseURL || this.baseURL,
      headers: {
        Accept: "application/json",
        "Client-ID": config.clientId,
      },
    });

    this.axiosInstance.interceptors.request.use(
      async (config) => {
        const token = await this.config.tokenManager.getToken();
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => this.handleApiError(error)
    );
  }

  async post<T>(endpoint: string, query: string): Promise<AxiosResponse<T>> {
    try {
      return await this.axiosInstance.post(endpoint, query);
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  static buildQuery(options: IGDBQueryOptions): string {
    const {
      fields = ["*"],
      where = [],
      sort = "",
      limit = 10,
      offset = 0,
    } = options;

    const parts = [
      `fields ${fields.join(",")};`,
      ...where.map((condition) => `where ${condition};`),
      sort && `sort ${sort};`,
      `limit ${limit};`,
      `offset ${offset};`,
    ].filter(Boolean);

    return parts.join(" ");
  }

  async searchGames<T>(options: {
    search?: string;
    fields?: string[];
    limit?: number;
  }): Promise<AxiosResponse<T>> {
    const query = IGDBApiClient.buildQuery({
      fields: options.fields || [
        "name",
        "first_release_date",
        "rating",
        "genres.name",
        "platforms.name",
        "cover.url",
        "involved_companies.company.name",
        "involved_companies.developer",
        "involved_companies.publisher",
      ],
      where: options.search ? [`name ~ *"${options.search}"*`] : [],
      limit: options.limit || 10,
    });

    return this.post<T>("/games", query);
  }

  async getTopRatedGames<T>(limit: number): Promise<AxiosResponse<T>> {
    const query = IGDBApiClient.buildQuery({
      fields: ["name", "rating", "first_release_date", "cover.url"],
      where: ["rating != null"],
      sort: "rating desc",
      limit,
    });

    return this.post<T>("/games", query);
  }

  async getUpcomingGames<T>(limit: number): Promise<AxiosResponse<T>> {
    const now = Math.floor(Date.now() / 1000); // UNIX timestamp actual
    const query = IGDBApiClient.buildQuery({
      fields: ["name", "first_release_date", "cover.url"],
      where: [`first_release_date > ${now}`],
      sort: "first_release_date asc",
      limit,
    });

    return this.post<T>("/games", query);
  }

  async getRecentReleaseGames<T>(limit: number): Promise<AxiosResponse<T>> {
    const now = Math.floor(Date.now() / 1000);
    const threeMonthsAgo = now - 90 * 24 * 60 * 60; // 90 días atrás

    const query = IGDBApiClient.buildQuery({
      fields: ["name", "first_release_date", "cover.url"],
      where: [
        `first_release_date <= ${now}`,
        `first_release_date >= ${threeMonthsAgo}`,
      ],
      sort: "first_release_date desc",
      limit,
    });

    return this.post<T>("/games", query);
  }

  private handleApiError(error: unknown): never {
    if (isAxiosError(error)) {
      if (error.response) {
        const { status, data } = error.response;
        switch (status) {
          case 401:
            throw new IGDBApiError(
              "Unauthorized: Invalid client ID or access token",
              status,
              error
            );
          case 429:
            throw new IGDBApiError(
              "Rate limit exceeded. Please try again later",
              status,
              error
            );
          case 500:
            throw new IGDBApiError(
              "IGDB API internal server error",
              status,
              error
            );
          default:
            throw new IGDBApiError(
              `IGDB API error: ${
                (data as { message?: string })?.message || error.message
              }`,
              status,
              error
            );
        }
      } else if (error.request) {
        throw new IGDBApiError(
          "Network error: Unable to reach IGDB API",
          undefined,
          error
        );
      }
    }

    if (error instanceof Error) {
      throw new IGDBApiError(
        `Error setting up request: ${error.message}`,
        undefined,
        error
      );
    }

    throw new IGDBApiError("An unknown error occurred");
  }
}
