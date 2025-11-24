import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GameEntry, GameStatus } from "@playloggd/domain";
import { apiClient } from "@/lib/api/client";
import {
  GameEntriesApiResponse,
  GameEntryApiResponse,
} from "@/types/responses";

interface GameCollectionState {
  entries: Map<string, GameEntry>;
  isLoading: boolean;
  error: string | null;

  fetchUserEntries: (userId: string) => Promise<void>;
  addGame: (gameExternalId: string, status: GameStatus) => Promise<void>;
  updateStatus: (gameExternalId: string, status: GameStatus) => Promise<void>;
  removeGame: (gameExternalId: string) => Promise<void>;
  getGameEntry: (gameExternalId: string) => GameEntry | undefined;
  clearCollection: () => void;
}

export const useGameCollectionStore = create<GameCollectionState>()(
  persist(
    (set, get) => ({
      entries: new Map(),
      isLoading: false,
      error: null,

      fetchUserEntries: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.get<GameEntriesApiResponse>(
            `/api/game-entries/${userId}`
          );

          const entriesMap = new Map<string, GameEntry>();
          response.data.forEach((entry: GameEntry) => {
            entriesMap.set(entry.gameExternalId, entry);
          });

          set({ entries: entriesMap, isLoading: false });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to fetch collection",
            isLoading: false,
          });
        }
      },

      addGame: async (gameExternalId: string, status: GameStatus) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.post<GameEntryApiResponse>(
            "/api/game-entry",
            { gameExternalId, status },
            { requiresAuth: true }
          );

          const newEntry = response.data;
          const entries = new Map(get().entries);
          entries.set(gameExternalId, newEntry);

          set({ entries, isLoading: false });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Failed to add game",
            isLoading: false,
          });
          throw error;
        }
      },

      updateStatus: async (gameExternalId: string, status: GameStatus) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.put<GameEntryApiResponse>(
            `/api/game-entry/update/${gameExternalId}`,
            { status },
            { requiresAuth: true }
          );

          const updatedEntry = response.data;
          const entries = new Map(get().entries);
          entries.set(gameExternalId, updatedEntry);

          set({ entries, isLoading: false });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to update status",
            isLoading: false,
          });
          throw error;
        }
      },

      removeGame: async (gameExternalId: string) => {
        set({ isLoading: true, error: null });
        try {
          await apiClient.delete(`/api/game-entry/delete/${gameExternalId}`, {
            requiresAuth: true,
          });

          const entries = new Map(get().entries);
          entries.delete(gameExternalId);

          set({ entries, isLoading: false });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Failed to remove game",
            isLoading: false,
          });
          throw error;
        }
      },

      getGameEntry: (gameExternalId: string) => {
        return get().entries.get(gameExternalId);
      },

      clearCollection: () => {
        set({ entries: new Map(), error: null, isLoading: false });
      },
    }),
    {
      name: "game-collection-storage",
      partialize: (state) => ({
        entries: Array.from(state.entries.entries()),
      }),
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray(state.entries)) {
          state.entries = new Map(state.entries as [string, GameEntry][]);
        }
      },
    }
  )
);
