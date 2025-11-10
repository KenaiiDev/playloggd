import { describe, it, expect, vi, beforeEach } from "vitest";
import { validateBody, validateParams } from "./validate-schema";
import { z, ZodType } from "zod";
import { Request, Response } from "express";
import { ZodError } from "zod/v4";

const mockRequest = (data: {
  body?: unknown;
  params?: Record<string, string>;
}): Partial<Request> => ({
  body: data.body,
  params: data.params,
});

const mockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.status = vi.fn().mockReturnThis();
  res.json = vi.fn().mockReturnThis();
  return res;
};

describe("Validation middleware", () => {
  const mockNext = vi.fn();

  beforeEach(() => {
    mockNext.mockClear();
  });

  describe("validateBody", () => {
    const bodySchema = z.object({
      username: z.string().min(3),
      email: z.string().email(),
    });

    it("should call next if body validation passes", () => {
      const req = mockRequest({
        body: {
          username: "testuser",
          email: "test@example.com",
        },
      });
      const res = mockResponse();

      validateBody(bodySchema)(req as Request, res as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it("should call next with ZodError if body validation fails", () => {
      const req = mockRequest({
        body: {
          username: "te",
          email: "invalid-email",
        },
      });
      const res = mockResponse();

      validateBody(bodySchema)(req as Request, res as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ZodError));
    });

    it("should handle unknown errors during body validation", () => {
      const malformedSchema = {
        parse: () => {
          throw new Error("Unknown error");
        },
      } as unknown as ZodType;
      const req = mockRequest({ body: {} });
      const res = mockResponse();

      validateBody(malformedSchema)(req as Request, res as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        new Error("Unknown validation error")
      );
    });
  });

  describe("validateParams", () => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
      slug: z.string().min(1),
    });

    it("should call next if params validation passes", () => {
      const req = mockRequest({
        params: {
          id: "123e4567-e89b-12d3-a456-426614174000",
          slug: "valid-slug",
        },
      });
      const res = mockResponse();

      validateParams(paramsSchema)(req as Request, res as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it("should call next with ZodError if params validation fails", () => {
      const req = mockRequest({
        params: {
          id: "invalid-uuid",
          slug: "",
        },
      });
      const res = mockResponse();

      validateParams(paramsSchema)(req as Request, res as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ZodError));
    });

    it("should handle unknown errors during params validation", () => {
      const malformedSchema = {
        parse: () => {
          throw new Error("Unknown error");
        },
      } as unknown as ZodType;
      const req = mockRequest({ params: {} });
      const res = mockResponse();

      validateParams(malformedSchema)(
        req as Request,
        res as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(
        new Error("Unknown validation error")
      );
    });
  });
});
