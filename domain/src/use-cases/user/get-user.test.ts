import { beforeEach, describe, expect, it } from "vitest";
import { mockReset } from "vitest-mock-extended";
import { createUserServiceMock } from "@services/__mocks__";
import { createMockUser } from "@/entities/__mocks__";
import { getUsers, getUsersByEmail } from "./get-user";

describe("Get users", () => {
  const userService = createUserServiceMock();

  beforeEach(() => {
    mockReset(userService);
  });

  describe("By id", () => {
    it("Should return an error if id is empty", async () => {
      const result = await getUsers({
        dependencies: { userService },
        payload: { id: "" },
      });

      expect(result).toBeInstanceOf(Error);
    });

    it("Should return an user when a registered id is given", async () => {
      // Crear usuario mock con ID específico
      const mockUser = createMockUser({ id: "123" });
      userService.getById.mockResolvedValue(mockUser);

      const result = await getUsers({
        dependencies: { userService },
        payload: { id: "123" },
      });

      expect(result).toEqual(mockUser);
      expect(userService.getById).toHaveBeenCalledWith("123");
      expect(userService.getById).toHaveBeenCalledOnce();
    });

    it("Should return undefined if the user is not found", async () => {
      userService.getById.mockResolvedValue(undefined);

      const result = await getUsers({
        dependencies: { userService },
        payload: { id: "nonexistent" },
      });

      expect(result).toBeUndefined();
      expect(userService.getById).toHaveBeenCalledWith("nonexistent");
    });

    it("Should return an error if id is null", async () => {
      const result = await getUsers({
        dependencies: { userService },
        payload: { id: null as unknown as string },
      });

      expect(result).toBeInstanceOf(Error);
    });

    it("Should return an error if id is undefined", async () => {
      const result = await getUsers({
        dependencies: { userService },
        payload: { id: undefined },
      });

      expect(result).toBeInstanceOf(Error);
    });

    it("Should return an error if id contains only spaces", async () => {
      const result = await getUsers({
        dependencies: { userService },
        payload: { id: "   " },
      });

      expect(result).toBeInstanceOf(Error);
    });

    it("Should handle service errors gracefully", async () => {
      const serviceError = new Error("Database connection failed");
      userService.getById.mockRejectedValue(serviceError);

      await expect(
        getUsers({
          dependencies: { userService },
          payload: { id: "123" },
        })
      ).rejects.toThrow("Database connection failed");

      expect(userService.getById).toHaveBeenCalledWith("123");
    });
  });

  describe("By email", () => {
    it("Should return an user when an email is given", async () => {
      const mockUser = createMockUser({ email: "test@example.com" });
      userService.getByEmail.mockResolvedValue(mockUser);

      const result = await getUsersByEmail({
        dependencies: { userService },
        payload: { email: "test@example.com" },
      });

      expect(result).toEqual(mockUser);
      expect(userService.getByEmail).toHaveBeenCalledWith("test@example.com");
      expect(userService.getByEmail).toHaveBeenCalledOnce();
    });

    it("Should return an error if email is empty", async () => {
      const result = await getUsersByEmail({
        dependencies: { userService },
        payload: { email: "" },
      });

      expect(result).toBeInstanceOf(Error);
    });

    it("Should return an error if email is null", async () => {
      const result = await getUsersByEmail({
        dependencies: { userService },
        payload: { email: null as unknown as string },
      });

      expect(result).toBeInstanceOf(Error);
    });

    it("Should return an error if email is undefined", async () => {
      const result = await getUsersByEmail({
        dependencies: { userService },
        payload: { email: undefined },
      });

      expect(result).toBeInstanceOf(Error);
    });

    it("Should return an error if email contains only spaces", async () => {
      const result = await getUsersByEmail({
        dependencies: { userService },
        payload: { email: "   " },
      });

      expect(result).toBeInstanceOf(Error);
    });

    it("Should return undefined if the user is not found by email", async () => {
      userService.getByEmail.mockResolvedValue(undefined);

      const result = await getUsersByEmail({
        dependencies: { userService },
        payload: { email: "nonexistent@test.com" },
      });

      expect(result).toBeUndefined();
      expect(userService.getByEmail).toHaveBeenCalledWith(
        "nonexistent@test.com"
      );
    });

    it("Should handle service errors gracefully", async () => {
      const serviceError = new Error("Database timeout");
      userService.getByEmail.mockRejectedValue(serviceError);

      await expect(
        getUsersByEmail({
          dependencies: { userService },
          payload: { email: "test@example.com" },
        })
      ).rejects.toThrow("Database timeout");

      expect(userService.getByEmail).toHaveBeenCalledWith("test@example.com");
    });
  });
});
