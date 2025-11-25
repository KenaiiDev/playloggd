import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { GamesApiResponse, GameApiResponse } from "@/types/responses";

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
export const useUpcomingGames = (options?: UseGamesOptions) =>
  useGames("/games/upcoming", options);

export function useSearchGames(query: string, options?: UseGamesOptions) {
  const { limit = 12, offset = 0, enabled = true } = options || {};

  return useQuery({
    queryKey: ["games", "search", query, limit, offset],
    queryFn: async () => {
      const response = await apiClient.get<GamesApiResponse>(
        `/api/games/search?q=${encodeURIComponent(
          query
        )}&limit=${limit}&offset=${offset}`
      );
      return {
        games: response.data,
        pagination: response.pagination,
      };
    },
    enabled: enabled && query.length >= 2,
  });
}

export function useGame(gameId: string) {
  return useQuery({
    queryKey: ["game", gameId],
    queryFn: async () => {
      const response = await apiClient.get<GameApiResponse>(
        `/api/games/${gameId}`
      );
      return response.data;
    },
    enabled: !!gameId,
  });
}
