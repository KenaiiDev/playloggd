import { describe, it, expect, beforeEach, vi } from "vitest";
import { DeepMockProxy, mockDeep } from "vitest-mock-extended";
import { UserController } from "./user-controller";
import { User } from "@playloggd/domain";
import { UserServiceImplementation } from "@/services/user-service-implementation";
import { AuthServiceImplementation } from "@/services/auth-service-implementation";
import { createRequest, createResponse } from "node-mocks-http";

describe("UserController", () => {
  let userController: UserController;
  let userServiceMock: DeepMockProxy<UserServiceImplementation>;
  let authServiceMock: DeepMockProxy<AuthServiceImplementation>;

  beforeEach(() => {
    userServiceMock = mockDeep<UserServiceImplementation>();
    authServiceMock = mockDeep<AuthServiceImplementation>();

    userController = new UserController(userServiceMock, authServiceMock);
  });

  describe("Register", () => {
    it("should call register with correct payload", async () => {
      const req = createRequest({
        method: "POST",
        url: "/register",
        body: {
          email: "a@b.com",
          password: "ValidPassword123",
          username: "test",
        },
      });

      const res = createResponse();
      res.status = vi.fn();
      res.json = vi.fn();

      const next = vi.fn();

      userServiceMock.create.mockResolvedValue({
        id: "1",
        email: "a@b.com",
      } as unknown as User);

      await userController.register(req, res, next);

      expect(userServiceMock.create).toHaveBeenCalledWith({
        email: "a@b.com",
        password: "ValidPassword123",
        username: "test",
        bio: undefined,
      });

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("should call next if user creation fails", async () => {
      const req = createRequest({
        method: "POST",
        url: "/register",
        body: {
          email: "test@example.com",
          password: "Valid123",
          username: "testuser",
        },
      });

      const res = createResponse();
      res.status = vi.fn().mockReturnThis();
      res.json = vi.fn();

      const next = vi.fn();

      userServiceMock.create.mockRejectedValueOnce(
        new Error("User creation failed")
      );

      await userController.register(req, res, next);

      expect(next).toHaveBeenCalledWith(new Error("User creation failed"));
    });
  });

  describe("GetUserById", () => {
    it("should return 200 and the user if getUserById succeeds", async () => {
      const req = createRequest({
        method: "GET",
        url: "/users/1",
        params: { id: "1" },
      });

      const res = createResponse();
      res.status = vi.fn().mockReturnThis();
      res.json = vi.fn();

      const next = vi.fn();

      userServiceMock.getById.mockResolvedValueOnce({
        id: "1",
        email: "test@example.com",
        username: "testuser",
        passwordHash: "hashed_password",
        avatarUrl: "",
        bio: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await userController.getUserById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should call next if user is not found in getUserById", async () => {
      const req = createRequest({
        method: "GET",
        url: "/users/1",
        params: { id: "1" },
      });

      const res = createResponse();
      res.status = vi.fn().mockReturnThis();
      res.json = vi.fn();

      const next = vi.fn();

      userServiceMock.getById.mockResolvedValueOnce(undefined);

      await userController.getUserById(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("GetUserByEmail", () => {
    it("should return 200 and the user if getUserByEmail succeeds", async () => {
      const req = createRequest({
        method: "GET",
        url: "/users/email",
        params: { email: "test@example.com" },
      });

      const res = createResponse();
      res.status = vi.fn().mockReturnThis();
      res.json = vi.fn();

      const next = vi.fn();

      userServiceMock.getByEmail.mockResolvedValueOnce({
        id: "1",
        email: "test@example.com",
        username: "testuser",
        passwordHash: "hashed_password",
        avatarUrl: "",
        bio: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await userController.getUserByEmail(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should call next if user is not found in getUserByEmail", async () => {
      const req = createRequest({
        method: "GET",
        url: "/users/email",
        query: { email: "test@example.com" },
      });

      const res = createResponse();
      res.status = vi.fn().mockReturnThis();
      res.json = vi.fn();

      const next = vi.fn();

      userServiceMock.getByEmail.mockResolvedValueOnce(undefined);

      await userController.getUserByEmail(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("DeleteUser", () => {
    it("should return 200 if deleteUser succeeds", async () => {
      const req = createRequest({
        method: "DELETE",
        url: "/users/1",
        params: { id: "1" },
        body: {
          password: "Password123",
        },
      });

      const res = createResponse();
      res.status = vi.fn().mockReturnThis();
      res.json = vi.fn();

      const next = vi.fn();

      userServiceMock.getById.mockResolvedValue({
        id: "1",
        email: "test@example.com",
        username: "testuser",
        passwordHash: "hashed_password",
        avatarUrl: "",
        bio: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      authServiceMock.verifyPassword.mockResolvedValue(true);
      userServiceMock.deleteUser.mockResolvedValueOnce(true);

      await userController.deleteUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should call next if user is not found in deleteUser", async () => {
      const req = createRequest({
        method: "DELETE",
        url: "/users/1",
        params: { id: "1" },
        body: {
          password: "Password123",
        },
      });

      const res = createResponse();
      res.status = vi.fn().mockReturnThis();
      res.json = vi.fn();

      const next = vi.fn();

      userServiceMock.getById.mockResolvedValue(undefined);
      authServiceMock.verifyPassword.mockResolvedValue(true);
      userServiceMock.deleteUser.mockResolvedValueOnce(false);

      await userController.deleteUser(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
