import { beforeEach, describe, expect, it } from "vitest";
import { mockReset } from "vitest-mock-extended";

import {
  createAuthServiceMock,
  createUserServiceMock,
} from "@/services/__mocks__";
import { createMockUser } from "@/entities/__mocks__";
import { register } from "./register";

describe("Register", () => {
  const userService = createUserServiceMock();
  const authService = createAuthServiceMock();

  beforeEach(() => {
    mockReset(userService);
  });

  it("Should create a user when correct data is provided", async () => {
    const userData = {
      username: "testuser",
      email: "test@example.com",
      password: "ValidPass123",
      bio: "Test bio",
    };

    const expectedUser = createMockUser({
      username: userData.username,
      email: userData.email,
      bio: userData.bio,
      passwordHash: `$2b$10$hashedversion_of_${userData.password}`,
    });

    userService.getByEmail.mockResolvedValue(undefined);
    userService.create.mockResolvedValue(expectedUser);

    const result = await register({
      dependencies: { userService, authService },
      payload: userData,
    });

    expect(result).toEqual(expectedUser);
    expect(userService.create).toHaveBeenCalled();
  });

  it("Should throw error if the email is already registered", async () => {
    const userData = {
      username: "testuser",
      email: "existing@example.com",
      password: "ValidPass123",
    };

    const existingUser = createMockUser({ email: userData.email });

    userService.getByEmail.mockResolvedValue(existingUser);

    await expect(
      register({
        dependencies: { userService },
        payload: userData,
      })
    ).rejects.toThrow(Error);
    expect(userService.create).not.toHaveBeenCalled();
  });

  it("Should throw error if no email is provided", async () => {
    const userData = {
      username: "testuser",
      email: "",
      password: "ValidPass123",
    };

    await expect(
      register({
        dependencies: { userService },
        payload: userData,
      })
    ).rejects.toThrow("Email is required");
    expect(userService.create).not.toHaveBeenCalled();
  });

  it("Should throw error if no password is provided", async () => {
    const userData = {
      username: "testuser",
      email: "test@test.com",
      password: "",
    };

    await expect(
      register({
        dependencies: { userService },
        payload: userData,
      })
    ).rejects.toThrow("Password is required");
    expect(userService.create).not.toHaveBeenCalled();
  });

  it("Should throw error if no username is provided", async () => {
    const userData = {
      username: "",
      email: "test@test.com",
      password: "ValidPass123",
    };

    await expect(
      register({
        dependencies: { userService },
        payload: userData,
      })
    ).rejects.toThrow("Username is required");
    expect(userService.create).not.toHaveBeenCalled();
  });

  it("should throw error when password is too short", async () => {
    const userData = {
      username: "testuser",
      email: "test@example.com",
      password: "short",
    };

    authService.validatePassword.mockImplementation(() => {
      throw new Error("Password must be at least 8 characters long");
    });

    await expect(
      register({
        dependencies: { userService, authService },
        payload: userData,
      })
    ).rejects.toThrow("Password must be at least 8 characters long");
    expect(userService.create).not.toHaveBeenCalled();
  });

  it("should throw error when password has no uppercase letters", async () => {
    const userData = {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    };

    authService.validatePassword.mockImplementation(() => {
      throw new Error("Password must contain at least one uppercase letter");
    });

    await expect(
      register({
        dependencies: { userService, authService },
        payload: userData,
      })
    ).rejects.toThrow("Password must contain at least one uppercase letter");
    expect(userService.create).not.toHaveBeenCalled();
  });

  it("should throw error when password has no lowercase letters", async () => {
    const userData = {
      username: "testuser",
      email: "test@example.com",
      password: "PASSWORD123",
    };

    authService.validatePassword.mockImplementation(() => {
      throw new Error("Password must contain at least one lowercase letter");
    });

    await expect(
      register({
        dependencies: { userService, authService },
        payload: userData,
      })
    ).rejects.toThrow("Password must contain at least one lowercase letter");
    expect(userService.create).not.toHaveBeenCalled();
  });

  it("should throw error when password has no numbers", async () => {
    const userData = {
      username: "testuser",
      email: "test@example.com",
      password: "PasswordNoNumbers",
    };

    authService.validatePassword.mockImplementation(() => {
      throw new Error("Password must contain at least one number");
    });

    await expect(
      register({
        dependencies: { userService, authService },
        payload: userData,
      })
    ).rejects.toThrow("Password must contain at least one number");
    expect(userService.create).not.toHaveBeenCalled();
  });
});
