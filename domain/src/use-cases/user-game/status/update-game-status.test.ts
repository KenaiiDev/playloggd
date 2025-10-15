import { beforeEach, describe, expect, it } from "vitest";
import { mockReset } from "vitest-mock-extended";

import { GameStatus, GameStatusEnum } from "@/entities/user-game";
import { createMockUser } from "@/entities/__mocks__/mock-user";
import { createUserGameServiceMock } from "@/services/__mocks__";
import { updateGameStatus } from "./update-game-status";

describe("Update Game Status Use Case", () => {
  const mockUser = createMockUser({
    id: "user-123",
  });

  const userGameService = createUserGameServiceMock();

  beforeEach(() => {
    mockReset(userGameService);
  });

  it("should update game status successfully", async () => {
    const payload = {
      userId: mockUser.id,
      gameExternalId: "game-123",
      status: GameStatusEnum.PLAYING,
    };

    const mockUpdatedUserGame = {
      id: "user-game-1",
      userId: mockUser.id,
      gameExternalId: payload.gameExternalId,
      status: payload.status,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    userGameService.updateGameStatus.mockResolvedValue(mockUpdatedUserGame);

    const result = await updateGameStatus({
      dependencies: { userGameService },
      payload,
    });

    expect(result).toEqual(mockUpdatedUserGame);
    expect(userGameService.updateGameStatus).toHaveBeenCalledWith(payload);
  });

  it("should return error when userId is empty", async () => {
    const payload = {
      userId: "",
      gameExternalId: "game-123",
      status: GameStatusEnum.PLAYING,
    };

    const result = await updateGameStatus({
      dependencies: { userGameService },
      payload,
    });

    expect(result).toBeInstanceOf(Error);
    expect(userGameService.updateGameStatus).not.toHaveBeenCalled();
  });

  it("should return error when gameExternalId is empty", async () => {
    const payload = {
      userId: mockUser.id,
      gameExternalId: "",
      status: GameStatusEnum.PLAYING,
    };

    const result = await updateGameStatus({
      dependencies: { userGameService },
      payload,
    });

    expect(result).toBeInstanceOf(Error);
    expect(userGameService.updateGameStatus).not.toHaveBeenCalled();
  });

  it("should return error when status is empty", async () => {
    const payload = {
      userId: mockUser.id,
      gameExternalId: "game-123",
      status: "" as GameStatus,
    };

    const result = await updateGameStatus({
      dependencies: { userGameService },
      payload,
    });

    expect(result).toBeInstanceOf(Error);
    expect(userGameService.updateGameStatus).not.toHaveBeenCalled();
  });
});
