import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import type { Game } from "@playloggd/domain";

export function useGames(endpoint: string) {
  return useQuery({
    queryKey: ["games", endpoint],
    queryFn: () => apiClient.get<Game[]>(`/api${endpoint}`),
  });
}

export const usePopularGames = (limit: number = 0, offset: number = 0) =>
  useGames(`/games/popular?limit=${limit}&offset=${offset}`);
export const useRecentGames = (limit: number, offset: number) =>
  useGames(`/games/recent?limit=${limit}&offset=${offset}`);
export const useTopRatedGames = (limit: number, offset: number) =>
  useGames(`/games/top?limit=${limit}&offset=${offset}`);
