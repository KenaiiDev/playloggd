import { describe, expect, it, beforeEach, vi } from "vitest";
import { Request, Response } from "express";
import { errorHandler } from "./error-handler";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ZodError, ZodIssueCode } from "zod";

describe("Error Handler Middleware", () => {
  let mockRequest: Request;
  let mockResponse: Response;

  beforeEach(() => {
    mockRequest = {} as Request;
    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as unknown as Response;
  });

  it("should handle default error with 500 status", () => {
    const error = new Error("Unexpected error");

    errorHandler(error, mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 500,
      statusMsg: "Internal Server Error",
      message: "Internal Server Error",
      error,
    });
  });

  it("should handle Prisma unique constraint error (P2002)", () => {
    const error = new PrismaClientKnownRequestError(
      "Unique constraint failed",
      {
        code: "P2002",
        clientVersion: "5.0.0",
      }
    );

    errorHandler(error, mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(409);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 409,
      statusMsg: "Conflict",
      message: "Unique constraint failed",
      error,
    });
  });

  it("should handle Prisma not found error (P2025)", () => {
    const error = new PrismaClientKnownRequestError("Record not found", {
      code: "P2025",
      clientVersion: "5.0.0",
    });

    errorHandler(error, mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 404,
      statusMsg: "Not Found",
      message: "Record not found",
    });
  });

  it("should handle Zod validation error with 400 status", () => {
    const error = new ZodError([
      {
        path: ["username"],
        message: "Username must be at least 3 characters long",
        code: ZodIssueCode.too_small,
        minimum: 3,
        inclusive: true,
        origin: "value",
      },
    ]);

    errorHandler(error, mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 400,
      statusMsg: "Bad Request",
      message: "Error de validación",
      error: error.issues,
    });
  });
});
