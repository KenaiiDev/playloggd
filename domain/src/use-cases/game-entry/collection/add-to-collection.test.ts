import { beforeEach, describe, expect, it } from "vitest";
import { mockReset } from "vitest-mock-extended";

import { GameStatusEnum } from "@/entities/game-entry";
import { createMockGame } from "@/entities/__mocks__/mock-game";
import { createMockUser } from "@/entities/__mocks__/mock-user";
import { createGameEntryServiceMock } from "@/services/__mocks__/";
import { addToCollection } from "./add-to-collection";

describe("Add To Collection Use Case", () => {
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

  it("should add game to collection successfully", async () => {
    const payload = {
      userId: mockUser.id,
      gameExternalId: mockGame.externalId,
      status: GameStatusEnum.WISHLIST,
    };

    const expectedUserGame = {
      id: "user-game-1",
      ...payload,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    userGameService.findUserGame.mockResolvedValue(undefined);
    userGameService.addUserGame.mockResolvedValue(expectedUserGame);

    const result = await addToCollection({
      dependencies: { userGameService },
      payload,
    });

    expect(result).toEqual(expectedUserGame);
    expect(userGameService.findUserGame).toHaveBeenCalledWith(
      mockUser.id,
      mockGame.externalId
    );
    expect(userGameService.addUserGame).toHaveBeenCalledWith(payload);
  });

  it("should throw error if game is already in collection", async () => {
    const payload = {
      userId: mockUser.id,
      gameExternalId: mockGame.externalId,
      status: GameStatusEnum.WISHLIST,
    };

    const existingUserGame = {
      id: "existing-user-game",
      ...payload,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    userGameService.findUserGame.mockResolvedValue(existingUserGame);

    await expect(
      addToCollection({
        dependencies: { userGameService },
        payload,
      })
    ).rejects.toThrow(Error);
    expect(userGameService.findUserGame).toHaveBeenCalledWith(
      mockUser.id,
      mockGame.externalId
    );
    expect(userGameService.addUserGame).not.toHaveBeenCalled();
  });

  it("should throw error when userId is empty", async () => {
    const payload = {
      userId: "",
      gameExternalId: mockGame.externalId,
      status: GameStatusEnum.WISHLIST,
    };

    await expect(
      addToCollection({
        dependencies: { userGameService },
        payload,
      })
    ).rejects.toThrow(Error);
    expect(userGameService.findUserGame).not.toHaveBeenCalled();
    expect(userGameService.addUserGame).not.toHaveBeenCalled();
  });

  it("should throw error when gameExternalId is empty", async () => {
    const payload = {
      userId: mockUser.id,
      gameExternalId: "",
      status: GameStatusEnum.WISHLIST,
    };

    await expect(
      addToCollection({
        dependencies: { userGameService },
        payload,
      })
    ).rejects.toThrow(Error);
    expect(userGameService.findUserGame).not.toHaveBeenCalled();
    expect(userGameService.addUserGame).not.toHaveBeenCalled();
  });
});
