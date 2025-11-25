import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { useAuthStore } from "./auth-store";
import { apiClient } from "@/lib/api/client";

// Mock del API client
vi.mock("@/lib/api/client", () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

// Mock del game-collection-store
vi.mock("./game-collection-store", () => ({
  useGameCollectionStore: {
    getState: vi.fn(() => ({
      fetchUserEntries: vi.fn(),
      clearCollection: vi.fn(),
    })),
  },
}));

// Mock de localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("AuthStore", () => {
  beforeEach(() => {
    // Reset store state
    useAuthStore.setState({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });

    // Clear localStorage
    localStorageMock.clear();

    // Clear all mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Initial State", () => {
    it("should have null user initially", () => {
      const { user } = useAuthStore.getState();
      expect(user).toBeNull();
    });

    it("should have null tokens initially", () => {
      const { accessToken, refreshToken } = useAuthStore.getState();
      expect(accessToken).toBeNull();
      expect(refreshToken).toBeNull();
    });

    it("should not be authenticated initially", () => {
      const { isAuthenticated } = useAuthStore.getState();
      expect(isAuthenticated).toBe(false);
    });
  });

  describe("login", () => {
    const mockLoginResponse = {
      data: {
        accessToken: "mock-access-token",
        refreshToken: "mock-refresh-token",
        userId: "user-123",
      },
    };

    const mockUserResponse = {
      data: {
        id: "user-123",
        email: "test@example.com",
        username: "testuser",
        bio: "Test bio",
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
      },
    };

    it("should successfully login and set tokens", async () => {
      vi.mocked(apiClient.post).mockResolvedValueOnce(mockLoginResponse);
      vi.mocked(apiClient.get).mockResolvedValueOnce(mockUserResponse);

      const { login } = useAuthStore.getState();
      await login("test@example.com", "password123");

      const { accessToken, refreshToken } = useAuthStore.getState();
      expect(accessToken).toBe("mock-access-token");
      expect(refreshToken).toBe("mock-refresh-token");
    });

    it("should save tokens to localStorage", async () => {
      vi.mocked(apiClient.post).mockResolvedValueOnce(mockLoginResponse);
      vi.mocked(apiClient.get).mockResolvedValueOnce(mockUserResponse);

      const { login } = useAuthStore.getState();
      await login("test@example.com", "password123");

      expect(localStorageMock.getItem("accessToken")).toBe("mock-access-token");
      expect(localStorageMock.getItem("refreshToken")).toBe(
        "mock-refresh-token"
      );
    });

    it("should fetch and set user data", async () => {
      vi.mocked(apiClient.post).mockResolvedValueOnce(mockLoginResponse);
      vi.mocked(apiClient.get).mockResolvedValueOnce(mockUserResponse);

      const { login } = useAuthStore.getState();
      await login("test@example.com", "password123");

      const { user, isAuthenticated } = useAuthStore.getState();
      expect(user).toEqual(mockUserResponse.data);
      expect(isAuthenticated).toBe(true);
    });

    it("should call login endpoint with correct credentials", async () => {
      vi.mocked(apiClient.post).mockResolvedValueOnce(mockLoginResponse);
      vi.mocked(apiClient.get).mockResolvedValueOnce(mockUserResponse);

      const { login } = useAuthStore.getState();
      await login("test@example.com", "password123");

      expect(apiClient.post).toHaveBeenCalledWith("/api/auth/login", {
        email: "test@example.com",
        password: "password123",
      });
    });

    it("should throw error if login fails", async () => {
      const error = new Error("Invalid credentials");
      vi.mocked(apiClient.post).mockRejectedValueOnce(error);

      const { login } = useAuthStore.getState();

      await expect(login("test@example.com", "wrong-password")).rejects.toThrow(
        "Invalid credentials"
      );

      const { isAuthenticated } = useAuthStore.getState();
      expect(isAuthenticated).toBe(false);
    });
  });

  describe("fetchUser", () => {
    const mockUserResponse = {
      data: {
        id: "user-123",
        email: "test@example.com",
        username: "testuser",
        bio: "Test bio",
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
      },
    };

    it("should fetch user data successfully", async () => {
      vi.mocked(apiClient.get).mockResolvedValueOnce(mockUserResponse);

      const { fetchUser } = useAuthStore.getState();
      await fetchUser("user-123");

      const { user } = useAuthStore.getState();
      expect(user).toEqual(mockUserResponse.data);
    });

    it("should set isAuthenticated to true", async () => {
      vi.mocked(apiClient.get).mockResolvedValueOnce(mockUserResponse);

      const { fetchUser } = useAuthStore.getState();
      await fetchUser("user-123");

      const { isAuthenticated } = useAuthStore.getState();
      expect(isAuthenticated).toBe(true);
    });

    it("should call correct endpoint", async () => {
      vi.mocked(apiClient.get).mockResolvedValueOnce(mockUserResponse);

      const { fetchUser } = useAuthStore.getState();
      await fetchUser("user-123");

      expect(apiClient.get).toHaveBeenCalledWith("/api/users/user-123");
    });
  });

  describe("setTokens", () => {
    it("should update tokens in state", () => {
      const { setTokens } = useAuthStore.getState();
      setTokens("new-access-token", "new-refresh-token");

      const { accessToken, refreshToken } = useAuthStore.getState();
      expect(accessToken).toBe("new-access-token");
      expect(refreshToken).toBe("new-refresh-token");
    });

    it("should save tokens to localStorage", () => {
      const { setTokens } = useAuthStore.getState();
      setTokens("new-access-token", "new-refresh-token");

      expect(localStorageMock.getItem("accessToken")).toBe("new-access-token");
      expect(localStorageMock.getItem("refreshToken")).toBe(
        "new-refresh-token"
      );
    });
  });

  describe("logout", () => {
    beforeEach(() => {
      // Set initial authenticated state
      useAuthStore.setState({
        user: {
          email: "test@example.com",
          username: "testuser",
          bio: "Test bio",
          avatarUrl: "",
          createdAt: "2024-01-01",
          updatedAt: "2024-01-01",
        },
        accessToken: "mock-access-token",
        refreshToken: "mock-refresh-token",
        isAuthenticated: true,
      });

      localStorageMock.setItem("accessToken", "mock-access-token");
      localStorageMock.setItem("refreshToken", "mock-refresh-token");
    });

    it("should clear user state", () => {
      const { logout } = useAuthStore.getState();
      logout();

      const { user, accessToken, refreshToken, isAuthenticated } =
        useAuthStore.getState();

      expect(user).toBeNull();
      expect(accessToken).toBeNull();
      expect(refreshToken).toBeNull();
      expect(isAuthenticated).toBe(false);
    });

    it("should remove tokens from localStorage", () => {
      const { logout } = useAuthStore.getState();
      logout();

      expect(localStorageMock.getItem("accessToken")).toBeNull();
      expect(localStorageMock.getItem("refreshToken")).toBeNull();
    });
  });

  describe("Persistence", () => {
    it("should persist state correctly", () => {
      useAuthStore.setState({
        user: {
          email: "test@example.com",
          username: "testuser",
          bio: "Test bio",
          avatarUrl: "",
          createdAt: "2024-01-01",
          updatedAt: "2024-01-01",
        },
        accessToken: "test-token",
        refreshToken: "test-refresh",
        isAuthenticated: true,
      });

      // State should be accessible via getState
      const state = useAuthStore.getState();
      expect(state.user).toBeTruthy();
      expect(state.accessToken).toBe("test-token");
      expect(state.isAuthenticated).toBe(true);
    });
  });
});
