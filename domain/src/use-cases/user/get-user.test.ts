import { describe, expect, it } from "vitest";

import { getUsers, getUsersByEmail } from "./get-user";
import { User } from "@/entities/user";

const mockedUsers: User[] = [
  {
    id: "1",
    username: "user",
    email: "test@test.com",
    passwordHash: "hashedPass",
    avatarUrl: "www.image.com/avatar",
    bio: "Lorem ipsum",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    username: "user2",
    email: "test2@test.com",
    passwordHash: "hashedPass",
    avatarUrl: "www.image.com/avatar",
    bio: "Lorem ipsum",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe("Get users", () => {
  const userService = {
    getById: async (id: string) => {
      return mockedUsers.find((user) => user.id === id);
    },
    getByEmail: async (email: string) => {
      return mockedUsers.find((user) => user.email === email);
    },
  };

  describe("By id", () => {
    it("Should return undefined if id is empty", async () => {
      const result = await getUsers({
        dependencies: { userService },
        payload: { id: "" },
      });

      expect(result).toBeUndefined();
    });

    it("Should return an user when a registered id is given", async () => {
      const result = await getUsers({
        dependencies: { userService },
        payload: { id: "1" },
      });

      expect(result).toStrictEqual({
        id: "1",
        username: "user",
        email: "test@test.com",
        passwordHash: "hashedPass",
        avatarUrl: "www.image.com/avatar",
        bio: "Lorem ipsum",
        createdAt: mockedUsers[0].createdAt,
        updatedAt: mockedUsers[0].updatedAt,
      });
    });

    it("Should return undefined if the user is not found", async () => {
      const result = await getUsers({
        dependencies: { userService },
        payload: { id: "4" },
      });

      expect(result).toBeUndefined();
    });

    it("Should return undefined if id is null", async () => {
      const result = await getUsers({
        dependencies: { userService },
        payload: { id: null as unknown as string },
      });

      expect(result).toBeUndefined();
    });

    it("Should return undefined if id is undefined", async () => {
      const result = await getUsers({
        dependencies: { userService },
        payload: { id: undefined },
      });

      expect(result).toBeUndefined();
    });

    it("Should return undefined if id contains only spaces", async () => {
      const result = await getUsers({
        dependencies: { userService },
        payload: { id: "   " },
      });

      expect(result).toBeUndefined();
    });
  });

  describe("By email", () => {
    it("Should return an user when an email is given", async () => {
      const result = await getUsersByEmail({
        dependencies: { userService },
        payload: { email: "test@test.com" },
      });

      expect(result).toStrictEqual({
        id: "1",
        username: "user",
        email: "test@test.com",
        passwordHash: "hashedPass",
        avatarUrl: "www.image.com/avatar",
        bio: "Lorem ipsum",
        createdAt: mockedUsers[0].createdAt,
        updatedAt: mockedUsers[0].updatedAt,
      });
    });

    it("Should return undefined if email is empty", async () => {
      const result = await getUsersByEmail({
        dependencies: { userService },
        payload: { email: "" },
      });

      expect(result).toBeUndefined();
    });

    it("Should return undefined if email is null", async () => {
      const result = await getUsersByEmail({
        dependencies: { userService },
        payload: { email: null as unknown as string },
      });

      expect(result).toBeUndefined();
    });

    it("Should return undefined if email is undefined", async () => {
      const result = await getUsersByEmail({
        dependencies: { userService },
        payload: { email: undefined },
      });

      expect(result).toBeUndefined();
    });

    it("Should return undefined if email contains only spaces", async () => {
      const result = await getUsersByEmail({
        dependencies: { userService },
        payload: { email: "   " },
      });

      expect(result).toBeUndefined();
    });

    it("Should return undefined if the user is not found by email", async () => {
      const result = await getUsersByEmail({
        dependencies: { userService },
        payload: { email: "nonexistent@test.com" },
      });

      expect(result).toBeUndefined();
    });
  });
});
