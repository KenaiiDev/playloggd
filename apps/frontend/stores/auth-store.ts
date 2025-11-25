import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@playloggd/domain";
import { apiClient } from "@/lib/api/client";
import { LoginApiResponse, UserApiResponse } from "@/types/responses";

export type UserStore = Omit<
  User,
  "passwordHash" | "createdAt" | "updatedAt"
> & {
  createdAt: string;
  updatedAt: string;
};

interface AuthState {
  user: UserStore | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchUser: (userId: string) => Promise<void>;
  setTokens: (accessToken: string, refreshToken: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      login: async (email, password) => {
        const response = await apiClient.post<LoginApiResponse>(
          "/api/auth/login",
          {
            email,
            password,
          }
        );

        const { accessToken, refreshToken, userId } = response.data;

        set({ accessToken, refreshToken });
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        await get().fetchUser(userId);

        const { useGameCollectionStore } = await import(
          "./game-collection-store"
        );
        await useGameCollectionStore.getState().fetchUserEntries(userId);
      },

      fetchUser: async (userId: string) => {
        const response = await apiClient.get<UserApiResponse>(
          `/api/users/${userId}`
        );
        const user = response.data;

        set({
          user,
          isAuthenticated: true,
        });
      },

      setTokens: (accessToken: string, refreshToken: string) => {
        set({ accessToken, refreshToken });
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        import("./game-collection-store").then(({ useGameCollectionStore }) => {
          useGameCollectionStore.getState().clearCollection();
        });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
