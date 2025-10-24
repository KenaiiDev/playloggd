import { beforeEach, describe, expect, it } from "vitest";
import { mockReset } from "vitest-mock-extended";

import { createMockUser } from "@/entities/__mocks__/mock-user";
import { createAuthServiceMock } from "@/services/__mocks__/mock-auth-service";
import { changePassword } from "./change-password";

describe("Change Password Use Case", () => {
  const mockUser = createMockUser({
    id: "user-123",
    email: "john@doe.com",
  });

  const authService = createAuthServiceMock();

  beforeEach(() => {
    mockReset(authService);
  });

  it("should change password successfully", async () => {
    const payload = {
      userId: mockUser.id,
      currentPassword: "oldPassword123",
      newPassword: "newPassword123",
    };

    authService.changePassword.mockResolvedValue(true);

    const result = await changePassword({
      dependencies: { authService },
      payload,
    });

    expect(result).toBe(true);
    expect(authService.changePassword).toHaveBeenCalledWith({ ...payload });
  });

  it("should throw error when userId is empty", async () => {
    const payload = {
      userId: "",
      currentPassword: "oldPassword123",
      newPassword: "newPassword123",
    };

    await expect(
      changePassword({ dependencies: { authService }, payload })
    ).rejects.toThrow();
    expect(authService.changePassword).not.toHaveBeenCalled();
  });

  it("should throw error when current password is empty", async () => {
    const payload = {
      userId: mockUser.id,
      currentPassword: "",
      newPassword: "newPassword123",
    };

    await expect(
      changePassword({ dependencies: { authService }, payload })
    ).rejects.toThrow();
    expect(authService.changePassword).not.toHaveBeenCalled();
  });

  it("should throw error when new password is empty", async () => {
    const payload = {
      userId: mockUser.id,
      currentPassword: "oldPassword123",
      newPassword: "",
    };

    await expect(
      changePassword({ dependencies: { authService }, payload })
    ).rejects.toThrow();
    expect(authService.changePassword).not.toHaveBeenCalled();
  });

  it("should throw error when current password is incorrect", async () => {
    const payload = {
      userId: mockUser.id,
      currentPassword: "wrongPassword",
      newPassword: "newPassword123",
    };

    const mockError = new Error("Current password is incorrect");
    authService.changePassword.mockRejectedValue(mockError);

    await expect(
      changePassword({ dependencies: { authService }, payload })
    ).rejects.toThrow("Current password is incorrect");
    expect(authService.changePassword).toHaveBeenCalledWith({ ...payload });
  });

  describe("Password Format Validation", () => {
    it("should throw error when new password is too short", async () => {
      const payload = {
        userId: mockUser.id,
        currentPassword: "oldPassword123",
        newPassword: "short",
      };

      authService.validatePassword.mockImplementation(() => {
        throw new Error("Password must be at least 8 characters long");
      });

      await expect(
        changePassword({ dependencies: { authService }, payload })
      ).rejects.toThrow("Password must be at least 8 characters long");
      expect(authService.changePassword).not.toHaveBeenCalled();
    });

    it("should throw error when new password has no uppercase letters", async () => {
      const payload = {
        userId: mockUser.id,
        currentPassword: "oldPassword123",
        newPassword: "password123",
      };

      authService.validatePassword.mockImplementation(() => {
        throw new Error("Password must contain at least one uppercase letter");
      });

      await expect(
        changePassword({ dependencies: { authService }, payload })
      ).rejects.toThrow("Password must contain at least one uppercase letter");
      expect(authService.changePassword).not.toHaveBeenCalled();
    });

    it("should throw error when new password has no lowercase letters", async () => {
      const payload = {
        userId: mockUser.id,
        currentPassword: "oldPassword123",
        newPassword: "PASSWORD123",
      };

      authService.validatePassword.mockImplementation(() => {
        throw new Error("Password must contain at least one lowercase letter");
      });

      await expect(
        changePassword({ dependencies: { authService }, payload })
      ).rejects.toThrow("Password must contain at least one lowercase letter");
      expect(authService.changePassword).not.toHaveBeenCalled();
    });

    it("should throw error when new password has no numbers", async () => {
      const payload = {
        userId: mockUser.id,
        currentPassword: "oldPassword123",
        newPassword: "PasswordNoNumbers",
      };

      authService.validatePassword.mockImplementation(() => {
        throw new Error("Password must contain at least one number");
      });

      await expect(
        changePassword({ dependencies: { authService }, payload })
      ).rejects.toThrow("Password must contain at least one number");
      expect(authService.changePassword).not.toHaveBeenCalled();
    });
  });
});
