import { beforeEach, describe, expect, it } from "vitest";
import { mockReset } from "vitest-mock-extended";

import { createUserServiceMock } from "@/services/__mocks__";
import { createMockUser } from "@/entities/__mocks__";
import { updateProfile } from "./update-profile";

describe("Update profile", () => {
  const userService = createUserServiceMock();

  beforeEach(() => {
    mockReset(userService);
  });

  it("Should update the user data when a registered email and correct data is provided", async () => {
    const userEmail = "test@example.com";
    const userData = {
      bio: "New bio",
    };
    const prevData = {
      username: "test",
      email: userEmail,
      passwordHash: `$2b$10$hashedPassword${userEmail}`,
    };
    const mockedUser = createMockUser(prevData);
    userService.getByEmail.mockResolvedValue(mockedUser);
    userService.update.mockResolvedValue({
      ...mockedUser,
      bio: userData.bio,
    });

    const result = await updateProfile({
      dependencies: { userService },
      payload: {
        user: userEmail,
        data: userData,
      },
    });

    expect(result).toStrictEqual({
      ...mockedUser,
      bio: userData.bio,
    });
  });

  it("Should throw error if no email is provided", async () => {
    const userEmail = "";
    const userData = {
      bio: "New bio",
    };
    const prevData = {
      username: "test",
      email: userEmail,
      passwordHash: `$2b$10$hashedPassword${userEmail}`,
    };
    const mockedUser = createMockUser(prevData);
    userService.getByEmail.mockResolvedValue(mockedUser);
    userService.update.mockResolvedValue({
      ...mockedUser,
      bio: userData.bio,
    });

    await expect(
      updateProfile({
        dependencies: { userService },
        payload: {
          user: userEmail,
          data: userData,
        },
      })
    ).rejects.toThrow(Error);
  });

  it("Should throw error if no data is provided", async () => {
    const userEmail = "test@test.com";
    const userData = {};
    const prevData = {
      username: "test",
      email: userEmail,
      passwordHash: `$2b$10$hashedPassword${userEmail}`,
    };
    const mockedUser = createMockUser(prevData);
    userService.getByEmail.mockResolvedValue(mockedUser);
    userService.update.mockResolvedValue({
      ...mockedUser,
      ...userData,
    });

    await expect(
      updateProfile({
        dependencies: { userService },
        payload: {
          user: userEmail,
          data: {},
        },
      })
    ).rejects.toThrow(Error);
  });

  it("Should throw error if email is only spaces is provided", async () => {
    const userEmail = "     ";
    const userData = {
      bio: "New bio",
    };
    const prevData = {
      username: "test",
      email: userEmail,
      passwordHash: `$2b$10$hashedPassword${userEmail}`,
    };
    const mockedUser = createMockUser(prevData);
    userService.getByEmail.mockResolvedValue(mockedUser);
    userService.update.mockResolvedValue({
      ...mockedUser,
      bio: userData.bio,
    });

    await expect(
      updateProfile({
        dependencies: { userService },
        payload: {
          user: userEmail,
          data: userData,
        },
      })
    ).rejects.toThrow(Error);
  });
});
