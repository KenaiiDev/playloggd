import { beforeEach, describe, expect, it } from "vitest";
import { mockReset } from "vitest-mock-extended";

import { createMockUser } from "@/entities/__mocks__/mock-user";
import {
  createUserServiceMock,
  createAuthServiceMock,
} from "@/services/__mocks__";
import { deleteAccount } from "./delete-account";

describe("Delete Account Use Case", () => {
  const mockUser = createMockUser({
    id: "user-123",
    email: "john@doe.com",
  });

  const userService = createUserServiceMock();
  const authService = createAuthServiceMock();

  beforeEach(() => {
    mockReset(userService);
    mockReset(authService);
  });

  it("should delete account successfully when correct password is provided", async () => {
    const payload = {
      userId: mockUser.id,
      password: "ValidPass123",
    };

    userService.getById.mockResolvedValue(mockUser);
    authService.verifyPassword.mockResolvedValue(true);
    userService.deleteUser.mockResolvedValue(true);

    const result = await deleteAccount({
      dependencies: { userService, authService },
      payload,
    });

    expect(result).toBe(true);
    expect(authService.verifyPassword).toHaveBeenCalledWith(
      payload.password,
      mockUser.passwordHash
    );
    expect(userService.deleteUser).toHaveBeenCalledWith(payload.userId);
  });

  it("should throw error when userId is empty", async () => {
    const payload = {
      userId: "",
      password: "ValidPass123",
    };

    await expect(
      deleteAccount({
        dependencies: { userService, authService },
        payload,
      })
    ).rejects.toThrow("User id is required");
    expect(authService.verifyPassword).not.toHaveBeenCalled();
    expect(userService.deleteUser).not.toHaveBeenCalled();
  });

  it("should throw error when password is empty", async () => {
    const payload = {
      userId: mockUser.id,
      password: "",
    };

    await expect(
      deleteAccount({
        dependencies: { userService, authService },
        payload,
      })
    ).rejects.toThrow("Password is required");
    expect(authService.verifyPassword).not.toHaveBeenCalled();
    expect(userService.deleteUser).not.toHaveBeenCalled();
  });

  it("should throw error when password is incorrect", async () => {
    const payload = {
      userId: mockUser.id,
      password: "WrongPass123",
    };

    userService.getById.mockResolvedValue(mockUser);
    authService.verifyPassword.mockResolvedValue(false);

    await expect(
      deleteAccount({
        dependencies: { userService, authService },
        payload,
      })
    ).rejects.toThrow("Invalid password");
    expect(authService.verifyPassword).toHaveBeenCalledWith(
      payload.password,
      mockUser.passwordHash
    );
    expect(userService.deleteUser).not.toHaveBeenCalled();
  });
});
