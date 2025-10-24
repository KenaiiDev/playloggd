import { beforeEach, describe, expect, it } from "vitest";
import { mockReset } from "vitest-mock-extended";

import { GameStatusEnum } from "@/entities/game-entry";
import { createMockGame } from "@/entities/__mocks__/mock-game";
import { createMockUser } from "@/entities/__mocks__/mock-user";
import { createGameEntryServiceMock } from "@/services/__mocks__/";
import { removeFromCollection } from "./remove-from-collection";

describe("Remove From Collection Use Case", () => {
  const mockGame = createMockGame({
    externalId: "game-123",
    title: "The Last of Us",
  });

  const mockUser = createMockUser({
    id: "user-123",
  });

  const userGameService = createGameEntryServiceMock();

  beforeEach(() => {
    mockReset(userGameService);
  });

  it("should remove game from collection successfully", async () => {
    const payload = {
      userId: mockUser.id,
      gameExternalId: mockGame.externalId,
    };

    const existingUserGame = {
      id: "user-game-1",
      userId: mockUser.id,
      gameExternalId: mockGame.externalId,
      status: GameStatusEnum.WISHLIST,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    userGameService.findUserGame.mockResolvedValue(existingUserGame);
    userGameService.removeUserGame.mockResolvedValue(undefined);

    const result = await removeFromCollection({
      dependencies: { userGameService },
      payload,
    });

    expect(result).toBeUndefined();
    expect(userGameService.findUserGame).toHaveBeenCalledWith(
      mockUser.id,
      mockGame.externalId
    );
    expect(userGameService.removeUserGame).toHaveBeenCalledWith(
      mockUser.id,
      mockGame.externalId
    );
  });

  it("should throw error if game is not in collection", async () => {
    const payload = {
      userId: mockUser.id,
      gameExternalId: mockGame.externalId,
    };

    userGameService.findUserGame.mockResolvedValue(undefined);

    await expect(
      removeFromCollection({
        dependencies: { userGameService },
        payload,
      })
    ).rejects.toThrow(Error);
    expect(userGameService.findUserGame).toHaveBeenCalledWith(
      mockUser.id,
      mockGame.externalId
    );
    expect(userGameService.removeUserGame).not.toHaveBeenCalled();
  });

  it("should throw error when userId is empty", async () => {
    const payload = {
      userId: "",
      gameExternalId: mockGame.externalId,
    };

    await expect(
      removeFromCollection({
        dependencies: { userGameService },
        payload,
      })
    ).rejects.toThrow(Error);
    expect(userGameService.findUserGame).not.toHaveBeenCalled();
    expect(userGameService.removeUserGame).not.toHaveBeenCalled();
  });

  it("should throw error when gameExternalId is empty", async () => {
    const payload = {
      userId: mockUser.id,
      gameExternalId: "",
    };

    await expect(
      removeFromCollection({
        dependencies: { userGameService },
        payload,
      })
    ).rejects.toThrow(Error);
    expect(userGameService.findUserGame).not.toHaveBeenCalled();
    expect(userGameService.removeUserGame).not.toHaveBeenCalled();
  });
});
