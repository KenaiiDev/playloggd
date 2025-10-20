import { describe, it, expect, beforeEach, vi } from "vitest";
import { AuthServiceImplementation } from "./auth-service-implementation";
import { JwtAdapter } from "../adapters/jwt-adapter";
import { BcryptAdapter } from "../adapters/bcrypt-adapter";
import { mockDeep, mockReset } from "vitest-mock-extended";
import { UserServiceImplementation } from "./user-service-implementation";
import { createMockUser } from "@playloggd/domain";

vi.mock("../adapters/jwt-adapter");
vi.mock("../adapters/bcrypt-adapter");

describe("AuthServiceImplementation", () => {
  let authService: AuthServiceImplementation;
  const jwtAdapter = mockDeep<JwtAdapter>();
  const bcryptAdapter = mockDeep<BcryptAdapter>();
  const userService = mockDeep<UserServiceImplementation>();

  beforeEach(() => {
    mockReset(jwtAdapter);
    mockReset(bcryptAdapter);
    mockReset(userService);

    authService = new AuthServiceImplementation(
      bcryptAdapter,
      jwtAdapter,
      jwtAdapter,
      userService
    );
  });

  describe("verifyPassword", () => {
    it("should return true for a valid password", async () => {
      bcryptAdapter.compare.mockResolvedValue(true);

      const result = await authService.verifyPassword(
        "plainPassword",
        "hashedPassword"
      );

      expect(result).toBe(true);
      expect(bcryptAdapter.compare).toHaveBeenCalledWith(
        "plainPassword",
        "hashedPassword"
      );
    });

    it("should return false for an invalid password", async () => {
      vi.spyOn(bcryptAdapter, "compare").mockResolvedValue(false);

      const result = await authService.verifyPassword(
        "plainPassword",
        "wrongHash"
      );

      expect(result).toBe(false);
      expect(bcryptAdapter.compare).toHaveBeenCalledWith(
        "plainPassword",
        "wrongHash"
      );
    });
  });

  describe("generateToken", () => {
    it("should generate access and refresh tokens", async () => {
      jwtAdapter.sign.mockReturnValue("userId-token");
      jwtAdapter.getExpiration.mockReturnValue(3600);

      const result = await authService.generateToken("userId");

      expect(result).toStrictEqual({
        accessToken: "userId-token",
        refreshToken: "userId-token",
        tokenType: "Bearer",
        expiresIn: 3600,
      });
      expect(jwtAdapter.sign).toHaveBeenCalledTimes(2);
    });
  });

  describe("verifyToken", () => {
    it("should return userId for a valid token", async () => {
      jwtAdapter.verify.mockReturnValue({ userId: "userId" });

      const result = await authService.verifyToken("validToken");

      expect(result).toStrictEqual({ userId: "userId" });
      expect(jwtAdapter.verify).toHaveBeenCalledWith("validToken");
    });

    it("should return null for an invalid token", async () => {
      vi.spyOn(jwtAdapter, "verify").mockResolvedValue(null);

      const result = await authService.verifyToken("invalidToken");

      expect(result).toBeNull();
      expect(jwtAdapter.verify).toHaveBeenCalledWith("invalidToken");
    });
  });

  describe("refreshToken", () => {
    it("should generate new tokens for a valid refresh token", async () => {
      jwtAdapter.verify.mockReturnValue({ userId: "userId" });
      jwtAdapter.sign.mockImplementation(
        (payload: { userId?: string } | string) => {
          if (typeof payload === "object" && payload.userId) {
            return `${payload.userId}-newToken`;
          }
          return `${payload}-newToken`;
        }
      );
      jwtAdapter.getExpiration.mockReturnValue(3600);

      const result = await authService.refreshToken("validRefreshToken");
      console.log({ result });

      expect(result).toStrictEqual({
        accessToken: "userId-newToken",
        refreshToken: "userId-newToken",
        tokenType: "Bearer",
        expiresIn: expect.any(Number),
      });
      expect(jwtAdapter.verify).toHaveBeenCalledWith("validRefreshToken");
      expect(jwtAdapter.sign).toHaveBeenCalledTimes(2);
    });

    it("should throw an error for an invalid refresh token", async () => {
      vi.spyOn(jwtAdapter, "verify").mockResolvedValue(null);

      await expect(
        authService.refreshToken("invalidRefreshToken")
      ).rejects.toThrow("Invalid refresh token");
      expect(jwtAdapter.verify).toHaveBeenCalledWith("invalidRefreshToken");
    });
  });

  describe("changePassword", () => {
    it("should change the password if the current password is valid", async () => {
      bcryptAdapter.compare.mockResolvedValue(true);
      bcryptAdapter.hash.mockResolvedValue("newHashedPassword");

      const mockUser = createMockUser({
        id: "userId",
        passwordHash: "hashedPassword",
      });

      userService.getById.mockResolvedValue(mockUser);

      const result = await authService.changePassword({
        userId: "userId",
        currentPassword: "currentPassword",
        newPassword: "newPassword123",
      });

      expect(result).toBe(true);
      expect(bcryptAdapter.compare).toHaveBeenCalledWith(
        "currentPassword",
        "hashedPassword"
      );
      expect(bcryptAdapter.hash).toHaveBeenCalledWith("newPassword123");
    });

    it("should throw an error if the current password is invalid", async () => {
      bcryptAdapter.compare.mockResolvedValue(false);
      const mockUser = createMockUser({
        id: "userId",
        passwordHash: "hashedPassword",
      });
      userService.getById.mockResolvedValue(mockUser);

      await expect(
        authService.changePassword({
          userId: "userId",
          currentPassword: "wrongPassword",
          newPassword: "newPassword",
        })
      ).rejects.toThrow("Current password is incorrect");
      expect(bcryptAdapter.compare).toHaveBeenCalledWith(
        "wrongPassword",
        "hashedPassword"
      );
    });
  });
});
