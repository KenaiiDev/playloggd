import { beforeEach, describe, expect, it } from "vitest";
import { mockReset } from "vitest-mock-extended";

import { createUserServiceMock } from "@/services/__mocks__";
import { createMockUser } from "@/entities/__mocks__";
import { register } from "./register";

describe("Register", () => {
  const userService = createUserServiceMock();

  beforeEach(() => {
    mockReset(userService);
  });

  it("Should create a user when correct data is provided", async () => {
    const userData = {
      username: "testuser",
      email: "test@example.com",
      password: "ValidPass123", // Updated to match password requirements
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
      dependencies: { userService },
      payload: userData,
    });

    expect(result).toEqual(expectedUser);
    expect(userService.create).toHaveBeenCalled();
  });

  it("Should return an error if the email is already registered", async () => {
    const userData = {
      username: "testuser",
      email: "existing@example.com",
      password: "ValidPass123", // Updated to match password requirements
    };

    const existingUser = createMockUser({ email: userData.email });

    userService.getByEmail.mockResolvedValue(existingUser);

    const result = await register({
      dependencies: { userService },
      payload: userData,
    });

    expect(result).toBeInstanceOf(Error);
    expect(userService.create).not.toHaveBeenCalled();
  });

  it("Should return an error if no email is provided", async () => {
    const userData = {
      username: "testuser",
      email: "",
      password: "ValidPass123", // Updated to match password requirements
    };

    const result = await register({
      dependencies: { userService },
      payload: userData,
    });

    expect(result).toBeInstanceOf(Error);
    if (result instanceof Error) {
      expect(result.message).toBe("Email is required");
    }
    expect(userService.create).not.toHaveBeenCalled();
  });

  it("Should return an error if no password is provided", async () => {
    const userData = {
      username: "testuser",
      email: "test@test.com",
      password: "",
    };

    const result = await register({
      dependencies: { userService },
      payload: userData,
    });

    expect(result).toBeInstanceOf(Error);
    if (result instanceof Error) {
      expect(result.message).toBe("Password is required");
    }
    expect(userService.create).not.toHaveBeenCalled();
  });

  it("Should return an error if no username is provided", async () => {
    const userData = {
      username: "",
      email: "test@test.com",
      password: "ValidPass123", // Updated to match password requirements
    };

    const result = await register({
      dependencies: { userService },
      payload: userData,
    });

    expect(result).toBeInstanceOf(Error);
    if (result instanceof Error) {
      expect(result.message).toBe("Username is required");
    }
    expect(userService.create).not.toHaveBeenCalled();
  });

  it("should return error when password is too short", async () => {
    const userData = {
      username: "testuser",
      email: "test@example.com",
      password: "short",
    };

    const result = await register({
      dependencies: { userService },
      payload: userData,
    });

    expect(result).toBeInstanceOf(Error);
    if (result instanceof Error) {
      expect(result.message).toBe(
        "Password must be at least 8 characters long"
      );
    }
    expect(userService.create).not.toHaveBeenCalled();
  });

  it("should return error when password has no uppercase letters", async () => {
    const userData = {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    };

    const result = await register({
      dependencies: { userService },
      payload: userData,
    });

    expect(result).toBeInstanceOf(Error);
    if (result instanceof Error) {
      expect(result.message).toBe(
        "Password must contain at least one uppercase letter"
      );
    }
    expect(userService.create).not.toHaveBeenCalled();
  });

  it("should return error when password has no lowercase letters", async () => {
    const userData = {
      username: "testuser",
      email: "test@example.com",
      password: "PASSWORD123",
    };

    const result = await register({
      dependencies: { userService },
      payload: userData,
    });

    expect(result).toBeInstanceOf(Error);
    if (result instanceof Error) {
      expect(result.message).toBe(
        "Password must contain at least one lowercase letter"
      );
    }
    expect(userService.create).not.toHaveBeenCalled();
  });

  it("should return error when password has no numbers", async () => {
    const userData = {
      username: "testuser",
      email: "test@example.com",
      password: "PasswordNoNumbers",
    };

    const result = await register({
      dependencies: { userService },
      payload: userData,
    });

    expect(result).toBeInstanceOf(Error);
    if (result instanceof Error) {
      expect(result.message).toBe("Password must contain at least one number");
    }
    expect(userService.create).not.toHaveBeenCalled();
  });
});
