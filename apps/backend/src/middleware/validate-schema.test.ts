import { describe, it, expect, vi } from "vitest";
import { validateSchema } from "./validate-schema";
import { z } from "zod";
import { Request, Response } from "express";

const mockRequest = <T>(body: T): Partial<Request> => ({ body });
const mockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.status = vi.fn().mockReturnThis();
  res.json = vi.fn().mockReturnThis();
  return res;
};
const mockNext = vi.fn();

describe("validateSchema middleware", () => {
  const schema = z.object({
    username: z.string().min(3),
    email: z.string().email(),
  });

  it("should call next if validation passes", () => {
    const req = mockRequest({
      username: "testuser",
      email: "test@example.com",
    });
    const res = mockResponse();

    validateSchema(schema)(req as Request, res as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("should call next with a validation error if validation fails", () => {
    const req = mockRequest({ username: "te", email: "invalid-email" });
    const res = mockResponse();

    validateSchema(schema)(req as Request, res as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
