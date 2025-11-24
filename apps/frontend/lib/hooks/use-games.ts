import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { GamesApiResponse } from "@/types/responses";

interface UseGamesOptions {
  limit?: number;
  offset?: number;
  enabled?: boolean;
}

export function useGames(endpoint: string, options: UseGamesOptions = {}) {
  const { limit = 12, offset = 0, enabled = true } = options;

  return useQuery({
    queryKey: ["games", endpoint, limit, offset],
    queryFn: async () => {
      const response = await apiClient.get<GamesApiResponse>(
        `/api${endpoint}?limit=${limit}&offset=${offset}`
      );
      return {
        games: response.data,
        pagination: response.pagination,
      };
    },
    enabled,
  });
}

export const usePopularGames = (options?: UseGamesOptions) =>
  useGames("/games/popular", options);
export const useRecentGames = (options?: UseGamesOptions) =>
  useGames("/games/recent", options);
export const useTopRatedGames = (options?: UseGamesOptions) =>
  useGames("/games/top", options);
