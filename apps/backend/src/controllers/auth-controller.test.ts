import { describe, it, expect, beforeEach, vi } from "vitest";
import { AuthController } from "./auth-controller";
import { createRequest, createResponse } from "node-mocks-http";

import { AuthServiceImplementation } from "@/services/__mocks__/auth-service-implementation";
import { UserServiceImplementation } from "@/services/__mocks__/user-service-implementation";
import { PasswordValidationError, ValidationError } from "@playloggd/domain";

vi.mock("../services/auth-service-implementation");
vi.mock("../services/user-service-implementation");

describe("AuthController", () => {
  let authController: AuthController;

  const mockToken = {
    accessToken: "access-jwt",
    refreshToken: "refresh-jwt",
    tokenType: "Bearer",
    expiresIn: 86400,
  };

  const mockUser = {
    avatarUrl: "",
    bio: "",
    createdAt: new Date(),
    email: "test@example.com",
    passwordHash: "hashed-password",
    id: "1",
    updatedAt: new Date(),
    username: "test",
  };

  beforeEach(() => {
    authController = new AuthController(
      UserServiceImplementation,
      AuthServiceImplementation
    );
  });
  describe("Login", () => {
    it("Should call login with correct payload", async () => {
      const req = createRequest({
        method: "POST",
        url: "/login",
        body: {
          email: "test@example.com",
          password: "Password.123",
        },
      });

      const res = createResponse();
      res.status = vi.fn();
      res.json = vi.fn();

      const next = vi.fn();

      AuthServiceImplementation.verifyPassword.mockResolvedValue(true);
      AuthServiceImplementation.generateToken.mockResolvedValue(mockToken);
      UserServiceImplementation.getByEmail.mockResolvedValue(mockUser);

      await authController.login(req, res, next);

      expect(UserServiceImplementation.getByEmail).toHaveBeenCalledWith(
        "test@example.com"
      );
      expect(AuthServiceImplementation.verifyPassword).toHaveBeenCalledWith(
        "Password.123",
        "hashed-password"
      );
      expect(AuthServiceImplementation.generateToken).toHaveBeenCalledWith("1");
    });

    it("Should call next if password is invalid", async () => {
      const req = createRequest({
        body: {
          email: "test@example.com",
          password: "Password.123",
        },
      });
      const res = createResponse();
      res.status = vi.fn().mockReturnThis();
      res.json = vi.fn();

      const next = vi.fn();

      UserServiceImplementation.getByEmail.mockResolvedValue(mockUser);

      AuthServiceImplementation.verifyPassword.mockResolvedValue(false);

      await authController.login(req, res, next);

      expect(next).toHaveBeenCalledWith(
        new PasswordValidationError("Invalid password")
      );
    });
  });

  describe("Change password", () => {
    it("Should call changePassword with correct payload", async () => {
      const req = createRequest({
        params: { id: "1" },
        body: {
          currentPassword: "Password.123",
          newPassword: "NewPass.123",
        },
      });
      const res = createResponse();
      const next = vi.fn();

      AuthServiceImplementation.validatePassword.mockImplementation(() => {});
      AuthServiceImplementation.changePassword.mockResolvedValue(true);

      await authController.changePassword(req, res, next);

      expect(AuthServiceImplementation.validatePassword).toHaveBeenCalledWith(
        "NewPass.123"
      );
      expect(AuthServiceImplementation.changePassword).toHaveBeenCalledWith({
        userId: "1",
        currentPassword: "Password.123",
        newPassword: "NewPass.123",
      });
    });

    it("Should call next if the new password is not valid", async () => {
      const req = createRequest({
        params: { id: "1" },
        body: {
          currentPassword: "Password.123",
          newPassword: "NewPass.123",
        },
      });
      const res = createResponse();
      const next = vi.fn();

      AuthServiceImplementation.validatePassword.mockImplementation(() => {
        throw new ValidationError("Password not valid");
      });

      await authController.changePassword(req, res, next);

      expect(next).toHaveBeenCalledWith(
        new ValidationError("Password not valid")
      );
    });
  });

  describe("Refresh token", () => {
    it("Should call refreshToken with correct payload", async () => {
      const req = createRequest({
        body: {
          refreshToken: "refresh-token",
        },
      });
      const res = createResponse();
      const next = vi.fn();

      AuthServiceImplementation.refreshToken.mockResolvedValue({
        accessToken: "new-token",
        expiresIn: 2000,
        refreshToken: "new-refresh",
        tokenType: "Bearer",
      });

      await authController.refreshToken(req, res, next);

      expect(AuthServiceImplementation.refreshToken).toHaveBeenCalledWith(
        "refresh-token"
      );
    });

    it("Should call next if payload is invalid", async () => {
      const req = createRequest({
        body: {},
      });
      const res = createResponse();
      const next = vi.fn();

      AuthServiceImplementation.refreshToken.mockImplementation(() => {
        throw new ValidationError("Refresh token is required");
      });

      await authController.refreshToken(req, res, next);

      expect(next).toHaveBeenCalledWith(
        new ValidationError("Refresh token is required")
      );
    });
  });
});
