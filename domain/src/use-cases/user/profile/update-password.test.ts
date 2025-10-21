import { beforeEach, describe, expect, it } from "vitest";
import { mockReset } from "vitest-mock-extended";
import { createUserServiceMock } from "@/services/__mocks__";
import { createAuthServiceMock } from "@/services/__mocks__/mock-auth-service";
import { updatePassword } from "./update-password";
import { createMockUser } from "@/entities/__mocks__";

describe("Update password", () => {
  const userService = createUserServiceMock();
  const authService = createAuthServiceMock();

  beforeEach(() => {
    mockReset(userService);
    mockReset(authService);
  });

  it("Should update the password when valid data is provided", async () => {
    const userId = "123";
    const currentPassword = "oldPassword";
    const newPassword = "newPassword123";
    const user = createMockUser({
      id: userId,
      passwordHash: "hashedOldPassword",
    });

    userService.getById.mockResolvedValue(user);
    authService.verifyPassword.mockResolvedValue(true);
    userService.updatePassword.mockResolvedValue(true);
    authService.validatePassword.mockReturnValue(null);

    const result = await updatePassword({
      dependencies: { userService, authService },
      payload: { userId, currentPassword, newPassword },
    });

    expect(result).toBe(true);
    expect(userService.getById).toHaveBeenCalledWith(userId);
    expect(authService.verifyPassword).toHaveBeenCalledWith(
      currentPassword,
      user.passwordHash
    );
    expect(userService.updatePassword).toHaveBeenCalledWith(
      userId,
      expect.any(String)
    );
  });

  it("Should return an error if the user is not found", async () => {
    const userId = "123";
    userService.getById.mockResolvedValue(undefined);

    const result = await updatePassword({
      dependencies: { userService, authService },
      payload: {
        userId,
        currentPassword: "oldPassword",
        newPassword: "newPassword",
      },
    });

    expect(result).toBeInstanceOf(Error);
    expect(userService.getById).toHaveBeenCalledWith(userId);
  });

  it("Should return an error if the current password is incorrect", async () => {
    const userId = "123";
    const user = createMockUser({
      id: userId,
      passwordHash: "hashedOldPassword",
    });

    userService.getById.mockResolvedValue(user);
    authService.verifyPassword.mockResolvedValue(false);

    const result = await updatePassword({
      dependencies: { userService, authService },
      payload: {
        userId,
        currentPassword: "wrongPassword",
        newPassword: "newPassword",
      },
    });

    expect(result).toBeInstanceOf(Error);
    expect(userService.getById).toHaveBeenCalledWith(userId);
    expect(authService.verifyPassword).toHaveBeenCalledWith(
      "wrongPassword",
      user.passwordHash
    );
  });

  it("Should return an error if the new password is invalid", async () => {
    const userId = "123";
    const user = createMockUser({
      id: userId,
      passwordHash: "hashedOldPassword",
    });

    userService.getById.mockResolvedValue(user);

    const result = await updatePassword({
      dependencies: { userService, authService },
      payload: { userId, currentPassword: "oldPassword", newPassword: "short" },
    });

    expect(result).toBeInstanceOf(Error);
  });
});
