import { describe, expect, it } from "vitest";
import { ApplicationError } from "./application-error";

describe("ApplicationError", () => {
  it("should create an error with default values", () => {
    const error = new ApplicationError("An error has occurred");

    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe("An error has occurred");
    expect(error.statusCode).toBe(500);
    expect(error.code).toBe("INTERNAL_SERVER_ERROR");
  });

  it("should create an error with custom status code and error code", () => {
    const error = new ApplicationError("Resource not found", 404, "NOT_FOUND");

    expect(error.message).toBe("Resource not found");
    expect(error.statusCode).toBe(404);
    expect(error.code).toBe("NOT_FOUND");
  });

  it("should maintain the error name as ApplicationError", () => {
    const error = new ApplicationError("An error");
    expect(error.name).toBe("ApplicationError");
  });

  it("should ensure statusCode is a number", () => {
    expect(
      () => new ApplicationError("Error", "400" as unknown as number)
    ).toThrow(TypeError);
  });

  it("should not allow empty error messages", () => {
    expect(() => new ApplicationError("")).toThrow(
      "Error message cannot be empty"
    );
    expect(() => new ApplicationError("   ")).toThrow(
      "Error message cannot be empty"
    );
  });

  it("should maintain error stack trace", () => {
    const error = new ApplicationError("An error");
    expect(error.stack).toBeDefined();
  });

  it("should allow extension for specific error types", () => {
    class NotFoundError extends ApplicationError {
      constructor(message: string) {
        super(message, 404, "NOT_FOUND");
      }
    }

    const error = new NotFoundError("User not found");
    expect(error).toBeInstanceOf(ApplicationError);
    expect(error).toBeInstanceOf(NotFoundError);
    expect(error.statusCode).toBe(404);
    expect(error.code).toBe("NOT_FOUND");
  });

  it("should have readonly statusCode and code", () => {
    const error = new ApplicationError("An error");
    expect(() => {
      (error as unknown as { statusCode: number }).statusCode = 400;
    }).toThrow();
    expect(() => {
      (error as unknown as { code: string }).code = "BAD_REQUEST";
    }).toThrow();
  });
});
