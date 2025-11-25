import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { useGameCollectionStore } from "./game-collection-store";
import { apiClient } from "@/lib/api/client";
import { GameStatusEnum, GameEntry } from "@playloggd/domain";

// Mock del API client
vi.mock("@/lib/api/client", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mock de localStorage para persist middleware
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

describe("GameCollectionStore", () => {
  beforeEach(() => {
    // Reset store state
    useGameCollectionStore.setState({
      entries: new Map(),
      isLoading: false,
      error: null,
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
    it("should have empty entries map initially", () => {
      const { entries } = useGameCollectionStore.getState();
      expect(entries.size).toBe(0);
    });

    it("should not be loading initially", () => {
      const { isLoading } = useGameCollectionStore.getState();
      expect(isLoading).toBe(false);
    });

    it("should have no error initially", () => {
      const { error } = useGameCollectionStore.getState();
      expect(error).toBeNull();
    });
  });

  describe("fetchUserEntries", () => {
    const mockEntries = [
      {
        userId: "user-123",
        gameExternalId: "game-1",
        status: GameStatusEnum.PLAYING,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
      {
        userId: "user-123",
        gameExternalId: "game-2",
        status: GameStatusEnum.COMPLETED,
        createdAt: new Date("2024-01-02"),
        updatedAt: new Date("2024-01-02"),
      },
    ] as unknown as GameEntry[];

    it("should fetch and store user entries", async () => {
      vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockEntries });

      const { fetchUserEntries } = useGameCollectionStore.getState();
      await fetchUserEntries("user-123");

      const { entries, isLoading, error } = useGameCollectionStore.getState();
      expect(entries.size).toBe(2);
      expect(entries.get("game-1")).toEqual(mockEntries[0]);
      expect(entries.get("game-2")).toEqual(mockEntries[1]);
      expect(isLoading).toBe(false);
      expect(error).toBeNull();
    });

    it("should set loading state while fetching", async () => {
      let resolvePromise: (value: unknown) => void;
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      vi.mocked(apiClient.get).mockReturnValue(promise);

      const { fetchUserEntries } = useGameCollectionStore.getState();
      const fetchPromise = fetchUserEntries("user-123");

      // Check loading state
      const { isLoading } = useGameCollectionStore.getState();
      expect(isLoading).toBe(true);

      // Resolve the promise
      resolvePromise!({ data: mockEntries });
      await fetchPromise;

      // Check loading state after completion
      const { isLoading: isLoadingAfter } = useGameCollectionStore.getState();
      expect(isLoadingAfter).toBe(false);
    });

    it("should handle fetch errors", async () => {
      const error = new Error("Network error");
      vi.mocked(apiClient.get).mockRejectedValueOnce(error);

      const { fetchUserEntries } = useGameCollectionStore.getState();
      await fetchUserEntries("user-123");

      const state = useGameCollectionStore.getState();
      expect(state.error).toBe("Network error");
      expect(state.isLoading).toBe(false);
    });

    it("should call correct API endpoint", async () => {
      vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockEntries });

      const { fetchUserEntries } = useGameCollectionStore.getState();
      await fetchUserEntries("user-123");

      expect(apiClient.get).toHaveBeenCalledWith("/api/game-entries/user-123");
    });
  });

  describe("addGame", () => {
    const mockNewEntry = {
      userId: "user-123",
      gameExternalId: "game-1",
      status: GameStatusEnum.WISHLIST,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    } as GameEntry;

    it("should add game to collection", async () => {
      vi.mocked(apiClient.post).mockResolvedValueOnce({ data: mockNewEntry });

      const { addGame } = useGameCollectionStore.getState();
      await addGame("game-1", GameStatusEnum.WISHLIST);

      const { entries } = useGameCollectionStore.getState();
      expect(entries.size).toBe(1);
      expect(entries.get("game-1")).toEqual(mockNewEntry);
    });

    it("should call correct API endpoint with body", async () => {
      vi.mocked(apiClient.post).mockResolvedValueOnce({ data: mockNewEntry });

      const { addGame } = useGameCollectionStore.getState();
      await addGame("game-1", GameStatusEnum.WISHLIST);

      expect(apiClient.post).toHaveBeenCalledWith(
        "/api/game-entry",
        { gameExternalId: "game-1", status: GameStatusEnum.WISHLIST },
        { requiresAuth: true }
      );
    });

    it("should handle add errors and rethrow", async () => {
      const error = new Error("Failed to add");
      vi.mocked(apiClient.post).mockRejectedValueOnce(error);

      const { addGame } = useGameCollectionStore.getState();

      await expect(addGame("game-1", GameStatusEnum.WISHLIST)).rejects.toThrow(
        "Failed to add"
      );

      const state = useGameCollectionStore.getState();
      expect(state.error).toBe("Failed to add");
      expect(state.isLoading).toBe(false);
    });

    it("should set loading state during add", async () => {
      let resolvePromise: (value: unknown) => void;
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      vi.mocked(apiClient.post).mockReturnValue(promise);

      const { addGame } = useGameCollectionStore.getState();
      const addPromise = addGame("game-1", GameStatusEnum.WISHLIST);

      expect(useGameCollectionStore.getState().isLoading).toBe(true);

      resolvePromise!({ data: mockNewEntry });
      await addPromise;

      expect(useGameCollectionStore.getState().isLoading).toBe(false);
    });
  });

  describe("updateStatus", () => {
    const mockUpdatedEntry = {
      userId: "user-123",
      gameExternalId: "game-1",
      status: GameStatusEnum.COMPLETED,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-02"),
    } as GameEntry;

    beforeEach(() => {
      // Set initial entry
      const initialEntry = {
        userId: "user-123",
        gameExternalId: "game-1",
        status: GameStatusEnum.PLAYING,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      } as GameEntry;

      useGameCollectionStore.setState({
        entries: new Map([["game-1", initialEntry]]),
      });
    });

    it("should update game status", async () => {
      vi.mocked(apiClient.put).mockResolvedValueOnce({
        data: mockUpdatedEntry,
      });

      const { updateStatus } = useGameCollectionStore.getState();
      await updateStatus("game-1", GameStatusEnum.COMPLETED);

      const { entries } = useGameCollectionStore.getState();
      expect(entries.get("game-1")?.status).toBe(GameStatusEnum.COMPLETED);
    });

    it("should call correct API endpoint", async () => {
      vi.mocked(apiClient.put).mockResolvedValueOnce({
        data: mockUpdatedEntry,
      });

      const { updateStatus } = useGameCollectionStore.getState();
      await updateStatus("game-1", GameStatusEnum.COMPLETED);

      expect(apiClient.put).toHaveBeenCalledWith(
        "/api/game-entry/update/game-1",
        { status: GameStatusEnum.COMPLETED },
        { requiresAuth: true }
      );
    });

    it("should handle update errors and rethrow", async () => {
      const error = new Error("Update failed");
      vi.mocked(apiClient.put).mockRejectedValueOnce(error);

      const { updateStatus } = useGameCollectionStore.getState();

      await expect(
        updateStatus("game-1", GameStatusEnum.COMPLETED)
      ).rejects.toThrow("Update failed");

      const state = useGameCollectionStore.getState();
      expect(state.error).toBe("Update failed");
    });
  });

  describe("removeGame", () => {
    beforeEach(() => {
      const entry = {
        userId: "user-123",
        gameExternalId: "game-1",
        status: GameStatusEnum.PLAYING,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      } as GameEntry;

      useGameCollectionStore.setState({
        entries: new Map([["game-1", entry]]),
      });
    });

    it("should remove game from collection", async () => {
      vi.mocked(apiClient.delete).mockResolvedValueOnce({});

      const { removeGame } = useGameCollectionStore.getState();
      await removeGame("game-1");

      const { entries } = useGameCollectionStore.getState();
      expect(entries.size).toBe(0);
      expect(entries.has("game-1")).toBe(false);
    });

    it("should call correct API endpoint", async () => {
      vi.mocked(apiClient.delete).mockResolvedValueOnce({});

      const { removeGame } = useGameCollectionStore.getState();
      await removeGame("game-1");

      expect(apiClient.delete).toHaveBeenCalledWith(
        "/api/game-entry/delete/game-1",
        { requiresAuth: true }
      );
    });

    it("should handle remove errors and rethrow", async () => {
      const error = new Error("Remove failed");
      vi.mocked(apiClient.delete).mockRejectedValueOnce(error);

      const { removeGame } = useGameCollectionStore.getState();

      await expect(removeGame("game-1")).rejects.toThrow("Remove failed");

      const state = useGameCollectionStore.getState();
      expect(state.error).toBe("Remove failed");
    });
  });

  describe("getGameEntry", () => {
    it("should return entry if exists", () => {
      const entry = {
        userId: "user-123",
        gameExternalId: "game-1",
        status: GameStatusEnum.PLAYING,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      } as GameEntry;

      useGameCollectionStore.setState({
        entries: new Map([["game-1", entry]]),
      });

      const { getGameEntry } = useGameCollectionStore.getState();
      const result = getGameEntry("game-1");

      expect(result).toEqual(entry);
    });

    it("should return undefined if entry does not exist", () => {
      const { getGameEntry } = useGameCollectionStore.getState();
      const result = getGameEntry("non-existent");

      expect(result).toBeUndefined();
    });
  });

  describe("clearCollection", () => {
    it("should clear all entries", () => {
      const entry = {
        userId: "user-123",
        gameExternalId: "game-1",
        status: GameStatusEnum.PLAYING,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      } as GameEntry;

      useGameCollectionStore.setState({
        entries: new Map([["game-1", entry]]),
        error: "Some error",
        isLoading: true,
      });

      const { clearCollection } = useGameCollectionStore.getState();
      clearCollection();

      const state = useGameCollectionStore.getState();
      expect(state.entries.size).toBe(0);
      expect(state.error).toBeNull();
      expect(state.isLoading).toBe(false);
    });
  });

  describe("Persistence", () => {
    it("should persist entries correctly", () => {
      const entry = {
        userId: "user-123",
        gameExternalId: "game-1",
        status: GameStatusEnum.PLAYING,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      } as GameEntry;

      useGameCollectionStore.setState({
        entries: new Map([["game-1", entry]]),
      });

      // State should be accessible via getState
      const state = useGameCollectionStore.getState();
      expect(state.entries.size).toBe(1);
      expect(state.entries.get("game-1")).toEqual(entry);
    });
  });
});
