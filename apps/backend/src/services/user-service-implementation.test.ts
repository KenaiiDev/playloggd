import { PrismaClient } from "@prisma/client";
import { UserServiceImplementation } from "./user-service-implementation";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { createMockUser } from "@playloggd/domain";
import { BcryptAdapter } from "../adapters/bcrypt-adapter";

vi.mock("@prisma/client", () => {
  const mockPrisma = {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  };
  return { PrismaClient: vi.fn(() => mockPrisma) };
});

describe("UserServiceImplementation", () => {
  let prisma: PrismaClient;
  let userService: UserServiceImplementation;
  let passwordHasher: BcryptAdapter;

  const mockPrisma = {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  };

  beforeEach(() => {
    prisma = mockPrisma as unknown as PrismaClient;
    passwordHasher = new BcryptAdapter();
    userService = new UserServiceImplementation(prisma, passwordHasher);
  });

  describe("getById", () => {
    it("should return a user when found", async () => {
      const mockUser = createMockUser({
        username: "testuser",
        email: "test@example.com",
        passwordHash: "hashedpassword",
        avatarUrl: undefined,
        bio: undefined,
      });

      const mockReturnedUser = {
        ...mockUser,
        id: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.user.findUnique.mockImplementation(
        async () => mockReturnedUser
      );

      const result = await userService.getById("1");

      expect(result).toStrictEqual(mockReturnedUser);
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: "1" },
      });
    });

    it("should return undefined when user is not found", async () => {
      mockPrisma.user.findUnique.mockImplementation(async () => null);

      const result = await userService.getById("1");

      expect(result).toBeUndefined();
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: "1" },
      });
    });

    it("should throw an error if the user ID is invalid", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const result = await userService.getById("invalid-id");

      expect(result).toBeUndefined();
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: "invalid-id" },
      });
    });
  });

  describe("getByEmail", () => {
    it("should return a user when found", async () => {
      const mockUser = createMockUser({
        username: "testuser",
        email: "test@example.com",
        passwordHash: "hashedpassword",
        avatarUrl: undefined,
        bio: undefined,
      });

      const mockReturnedUser = {
        ...mockUser,
        id: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.user.findUnique.mockImplementation(
        async () => mockReturnedUser
      );

      const result = await userService.getByEmail("test@example.com");

      expect(result).toStrictEqual(mockReturnedUser);
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      });
    });

    it("should return undefined when user is not found", async () => {
      mockPrisma.user.findUnique.mockImplementation(async () => null);

      const result = await userService.getByEmail("test@example.com");

      expect(result).toBeUndefined();
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      });
    });

    it("should throw an error if the email is invalid", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const result = await userService.getByEmail("invalid-email@example.com");

      expect(result).toBeUndefined();
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: "invalid-email@example.com" },
      });
    });
  });

  describe("create", () => {
    it("should hash the password and create a user", async () => {
      const mockUser = createMockUser({
        username: "testuser",
        email: "test@example.com",
        passwordHash: "hashedpassword",
        avatarUrl: undefined,
        bio: undefined,
      });

      const mockReturnedUser = {
        ...mockUser,
        id: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const hashSpy = vi
        .spyOn(passwordHasher, "hash")
        .mockResolvedValue("hashedpassword");
      mockPrisma.user.create.mockImplementation(async () => mockReturnedUser);

      const result = await userService.create({
        username: "testuser",
        email: "test@example.com",
        password: "plainpassword",
      });

      expect(hashSpy).toHaveBeenCalledWith("plainpassword");
      expect(result).toStrictEqual(mockReturnedUser);
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          username: "testuser",
          email: "test@example.com",
          passwordHash: "hashedpassword",
          avatarUrl: "",
          bio: "",
        },
      });
    });

    it("should throw an error if the password hashing fails", async () => {
      vi.spyOn(passwordHasher, "hash").mockRejectedValue(
        new Error("Hashing failed")
      );

      await expect(
        userService.create({
          username: "testuser",
          email: "test@example.com",
          password: "plainpassword",
        })
      ).rejects.toThrow("Hashing failed");
    });
  });

  describe("update", () => {
    it("should update and return a user", async () => {
      const mockUser = createMockUser({
        username: "updateduser",
        email: "updated@example.com",
        passwordHash: "hashedpassword",
        avatarUrl: undefined,
        bio: undefined,
      });

      const mockReturnedUser = {
        ...mockUser,
        id: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.user.update.mockImplementation(async () => mockReturnedUser);

      const result = await userService.update({
        user: "1",
        data: {
          username: "updateduser",
        },
      });

      expect(result).toStrictEqual(mockReturnedUser);
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: "1" },
        data: { username: "updateduser" },
      });
    });

    it("should throw an error if the user does not exist", async () => {
      mockPrisma.user.update.mockImplementation(async () => {
        throw new Error("User not found");
      });

      await expect(
        userService.update({
          user: "nonexistent-id",
          data: { username: "updateduser" },
        })
      ).rejects.toThrow("User not found");
    });
  });

  describe("deleteUser", () => {
    it("should delete a user and return true", async () => {
      mockPrisma.user.delete.mockResolvedValue({});

      const result = await userService.deleteUser("1");

      expect(result).toBe(true);
      expect(mockPrisma.user.delete).toHaveBeenCalledWith({
        where: { id: "1" },
      });
    });

    it("should throw an error if the user does not exist", async () => {
      mockPrisma.user.delete.mockImplementation(async () => {
        throw new Error("User not found");
      });

      await expect(userService.deleteUser("nonexistent-id")).rejects.toThrow(
        "User not found"
      );
    });
  });

  describe("updatePassword", () => {
    it("should update the password when valid data is provided", async () => {
      const userId = "123";
      const hashedPassword = "hashedNewPassword";

      mockPrisma.user.update.mockResolvedValue({
        id: userId,
        passwordHash: hashedPassword,
      });

      const result = await userService.updatePassword(userId, hashedPassword);

      expect(result).toBe(true);
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { passwordHash: hashedPassword },
      });
    });

    it("should return false if the user does not exist", async () => {
      const userId = "123";
      const hashedPassword = "hashedNewPassword";

      mockPrisma.user.update.mockResolvedValue(null);

      const result = await userService.updatePassword(userId, hashedPassword);

      expect(result).toBe(false);

      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { passwordHash: hashedPassword },
      });
    });
  });
});
