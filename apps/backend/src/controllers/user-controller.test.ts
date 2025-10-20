import { describe, it, expect, beforeEach, vi } from "vitest";
import { createUserServiceImplementationMocks } from "@/services/__mocks__/user-service-implementation-mock";
import { createMockUser } from "@playloggd/domain";
import { UserController } from "./user-controller";
import { Request, Response, NextFunction } from "express";
import { mockReset } from "vitest-mock-extended";

describe("UserController", () => {
  let userController: UserController;
  let mockRes: Response;
  let mockNext: NextFunction;
  const mockUserService = createUserServiceImplementationMocks();

  beforeEach(() => {
    mockReset(mockUserService);
    userController = new UserController(mockUserService);
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      send: vi.fn(),
    } as unknown as Response;
    mockNext = vi.fn();
  });

  describe("register", () => {
    it("should return 201 and the created user", async () => {
      const mockReq = {
        body: {
          username: "testuser",
          email: "test@example.com",
          password: "password",
        },
      } as Request;
      const mockUser = createMockUser({
        id: "1",
        username: "testuser",
        email: "test@example.com",
      });
      mockUserService.create.mockResolvedValue(mockUser);

      await userController.register(mockReq, mockRes, mockNext);

      expect(mockUserService.create).toHaveBeenCalledWith(mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 201,
        statusMsg: "Created",
        data: mockUser,
      });
    });

    it("should return 400 if the service throws an error", async () => {
      const mockReq = {
        body: { username: "", email: "", password: "" },
      } as Request;
      mockUserService.create.mockRejectedValue(new Error("Validation failed"));

      await userController.register(mockReq, mockRes, mockNext);

      expect(mockUserService.create).toHaveBeenCalledWith(mockReq.body);
      expect(mockNext).toHaveBeenCalledWith(new Error("Validation failed"));
    });
  });

  describe("getUserById", () => {
    it("should return 200 and the user if found", async () => {
      const mockReq = { params: { id: "1" } } as unknown as Request;
      const mockUser = createMockUser({
        id: "1",
        username: "testuser",
        email: "test@example.com",
      });
      mockUserService.getById.mockResolvedValue(mockUser);

      await userController.getUserById(mockReq, mockRes, mockNext);

      expect(mockUserService.getById).toHaveBeenCalledWith("1");
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 200,
        statusMsg: "Success",
        data: mockUser,
      });
    });

    it("should return 404 if the user is not found", async () => {
      const mockReq = { params: { id: "1" } } as unknown as Request;
      mockUserService.getById.mockResolvedValue(undefined);

      await userController.getUserById(mockReq, mockRes, mockNext);

      expect(mockUserService.getById).toHaveBeenCalledWith("1");
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 404,
        statusMsg: "Not Found",
        message: "User not found",
      });
    });

    it("should call next with an error if the service throws an error", async () => {
      const mockReq = { params: { id: "1" } } as Partial<Request>;
      const error = new Error("Database error");
      mockUserService.getById.mockImplementation(() => Promise.reject(error));

      await userController.getUserById(mockReq as Request, mockRes, mockNext);

      expect(mockUserService.getById).toHaveBeenCalledWith("1");
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("getUserByEmail", () => {
    it("should return 200 and the user if found", async () => {
      const mockReq = {
        params: { email: "test@example.com" },
      } as unknown as Request;
      const mockUser = createMockUser({
        id: "1",
        username: "testuser",
        email: "test@example.com",
      });
      mockUserService.getByEmail.mockResolvedValue(mockUser);

      await userController.getUserByEmail(mockReq, mockRes, mockNext);

      expect(mockUserService.getByEmail).toHaveBeenCalledWith(
        "test@example.com"
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 200,
        statusMsg: "Success",
        data: mockUser,
      });
    });

    it("should return 404 if the user is not found", async () => {
      const mockReq = {
        params: { email: "test@example.com" },
      } as unknown as Request;
      mockUserService.getByEmail.mockResolvedValue(undefined);

      await userController.getUserByEmail(mockReq, mockRes, mockNext);

      expect(mockUserService.getByEmail).toHaveBeenCalledWith(
        "test@example.com"
      );
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 404,
        statusMsg: "Not Found",
        message: "User not found",
      });
    });

    it("should call next with an error if the service throws an error", async () => {
      const mockReq = {
        params: { email: "test@example.com" },
      } as Partial<Request>;
      const error = new Error("Database error");
      mockUserService.getByEmail.mockImplementation(() =>
        Promise.reject(error)
      );

      await userController.getUserByEmail(
        mockReq as Request,
        mockRes,
        mockNext
      );

      expect(mockUserService.getByEmail).toHaveBeenCalledWith(
        "test@example.com"
      );
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("updateUser", () => {
    it("should return 200 and the updated user", async () => {
      const mockReq = {
        params: { id: "1" },
        body: { username: "updatedUser" },
      } as unknown as Request;
      const mockUser = createMockUser({
        id: "1",
        username: "updatedUser",
        email: "test@example.com",
      });
      mockUserService.update.mockResolvedValue(mockUser);

      await userController.updateUser(mockReq, mockRes, mockNext);

      expect(mockUserService.update).toHaveBeenCalledWith({
        user: "1",
        data: { username: "updatedUser" },
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 200,
        statusMsg: "Success",
        data: mockUser,
      });
    });

    it("should call next with an error if the service throws an error", async () => {
      const mockReq = {
        params: { id: "1" },
        body: { username: "updatedUser" },
      } as Partial<Request>;
      const error = new Error("Update failed");
      mockUserService.update.mockImplementation(() => Promise.reject(error));

      await userController.updateUser(mockReq as Request, mockRes, mockNext);

      expect(mockUserService.update).toHaveBeenCalledWith({
        user: "1",
        data: { username: "updatedUser" },
      });
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("deleteUser", () => {
    it("should return 200 if the user is successfully deleted", async () => {
      const mockReq = { params: { id: "1" } } as unknown as Request;
      mockUserService.deleteUser.mockResolvedValue(true);

      await userController.deleteUser(mockReq, mockRes, mockNext);

      expect(mockUserService.deleteUser).toHaveBeenCalledWith("1");
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 200,
        statusMsg: "Success",
        data: "User deleted successfully",
      });
    });

    it("should return 404 if the user is not found", async () => {
      const mockReq = { params: { id: "1" } } as unknown as Request;
      mockUserService.deleteUser.mockResolvedValue(false);

      await userController.deleteUser(mockReq, mockRes, mockNext);

      expect(mockUserService.deleteUser).toHaveBeenCalledWith("1");
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 404,
        statusMsg: "Not Found",
        message: "User not found",
      });
    });

    it("should call next with an error if the service throws an error", async () => {
      const mockReq = { params: { id: "1" } } as Partial<Request>;
      const error = new Error("Delete failed");
      mockUserService.deleteUser.mockImplementation(() =>
        Promise.reject(error)
      );

      await userController.deleteUser(mockReq as Request, mockRes, mockNext);

      expect(mockUserService.deleteUser).toHaveBeenCalledWith("1");
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
