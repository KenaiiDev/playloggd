import { beforeEach, describe, expect, it } from "vitest";
import { mockReset } from "vitest-mock-extended";

import { login } from "./login";
import {
  createAuthServiceMock,
  createUserServiceMock,
} from "@/services/__mocks__/";
import { createMockUser } from "@/entities/__mocks__";

describe("Login", () => {
  const authService = createAuthServiceMock();
  const userService = createUserServiceMock();

  beforeEach(() => {
    mockReset(authService);
    mockReset(userService);
  });

  it("Should return token when valid credentials are provided", async () => {
    const mockUser = createMockUser({
      email: "test@example.com",
      passwordHash: "$2b$10$hashedpassword",
    });

    const mockTokens = {
      accessToken: "access-token",
      refreshToken: "refresh-token",
      tokenType: "Bearer",
      expiresIn: 86400,
    };

    userService.getByEmail.mockResolvedValue(mockUser);
    authService.verifyPassword.mockResolvedValue(true);
    authService.generateToken.mockResolvedValue(mockTokens);

    const result = await login({
      dependencies: { userService, authService },
      payload: {
        email: "test@example.com",
        password: "password123",
      },
    });

    expect(result).toEqual({
      accessToken: "access-token",
      refreshToken: "refresh-token",
      expiresIn: 86400,
      tokenType: "Bearer",
    });
    expect(userService.getByEmail).toHaveBeenCalledWith("test@example.com");
    expect(authService.verifyPassword).toHaveBeenCalledWith(
      "password123",
      mockUser.passwordHash
    );
    expect(authService.generateToken).toHaveBeenCalledWith(mockUser.id);
  });

  it("Should return an error if email is empty", async () => {
    const result = await login({
      dependencies: { userService, authService },
      payload: {
        email: "",
        password: "password123",
      },
    });

    expect(result).toBeInstanceOf(Error);
    if (result instanceof Error) {
      expect(result.message).toBe("Email is required");
    }
  });

  it("Should return an error if password is empty", async () => {
    const result = await login({
      dependencies: { userService, authService },
      payload: {
        email: "test@example.com",
        password: "",
      },
    });

    expect(result).toBeInstanceOf(Error);
    if (result instanceof Error) {
      expect(result.message).toBe("Password is required");
    }
  });

  it("Should return an error if user is not found", async () => {
    const result = await login({
      dependencies: { userService, authService },
      payload: {
        email: "nouser@test.com",
        password: "password123",
      },
    });

    expect(result).toBeInstanceOf(Error);
    if (result instanceof Error) {
      expect(result.message).toBe("No user found");
    }
  });

  it("Should return an error if password is invalid", async () => {
    const mockUser = createMockUser({
      email: "test@example.com",
      passwordHash: "$2b$10$hashedpassword",
    });

    const mockTokens = {
      accessToken: "access-token",
      refreshToken: "refresh-token",
      tokenType: "Bearer",
      expiresIn: 86400,
    };

    userService.getByEmail.mockResolvedValue(mockUser);
    authService.verifyPassword.mockResolvedValue(false);
    authService.generateToken.mockResolvedValue(mockTokens);

    const result = await login({
      dependencies: { userService, authService },
      payload: {
        email: "test@example.com",
        password: "password123",
      },
    });

    expect(result).toBeInstanceOf(Error);
  });
});
