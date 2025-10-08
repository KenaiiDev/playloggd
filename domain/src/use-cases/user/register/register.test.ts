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
      password: "password123",
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
  });

  it("Should return an error if the email is already registered", async () => {
    const userData = {
      username: "testuser",
      email: "existing@example.com",
      password: "password123",
    };

    const existingUser = createMockUser({ email: userData.email });

    userService.getByEmail.mockResolvedValue(existingUser);

    const result = await register({
      dependencies: { userService },
      payload: userData,
    });

    expect(result).toBeInstanceOf(Error);
  });

  it("Should return an error if no email is provided", async () => {
    const userData = {
      username: "testuser",
      email: "",
      password: "password123",
    };

    const result = await register({
      dependencies: { userService },
      payload: userData,
    });

    expect(result).toBeInstanceOf(Error);
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
  });

  it("Should return an error if no username is provided", async () => {
    const userData = {
      username: "",
      email: "test@test.com",
      password: "password123",
    };

    const result = await register({
      dependencies: { userService },
      payload: userData,
    });

    expect(result).toBeInstanceOf(Error);
  });
});
