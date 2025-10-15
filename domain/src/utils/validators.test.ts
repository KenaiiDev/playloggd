import { describe, expect, it } from "vitest";
import { validatePassword } from "./validators";

describe("Password Validator", () => {
  it("should return null for valid password", () => {
    const result = validatePassword("ValidPass123");
    expect(result).toBeNull();
  });

  it("should return error when password is too short", () => {
    const result = validatePassword("Short1");
    expect(result).toBeInstanceOf(Error);
    expect(result?.message).toBe("Password must be at least 8 characters long");
  });

  it("should return error when password has no uppercase letters", () => {
    const result = validatePassword("lowercase123");
    expect(result).toBeInstanceOf(Error);
    expect(result?.message).toBe(
      "Password must contain at least one uppercase letter"
    );
  });

  it("should return error when password has no lowercase letters", () => {
    const result = validatePassword("UPPERCASE123");
    expect(result).toBeInstanceOf(Error);
    expect(result?.message).toBe(
      "Password must contain at least one lowercase letter"
    );
  });

  it("should return error when password has no numbers", () => {
    const result = validatePassword("NoNumbersHere");
    expect(result).toBeInstanceOf(Error);
    expect(result?.message).toBe("Password must contain at least one number");
  });

  it("should validate password with special characters", () => {
    const result = validatePassword("Valid@Pass123!");
    expect(result).toBeNull();
  });

  it("should validate password with exactly minimum length", () => {
    const result = validatePassword("ValidPw1"); // 8 characters
    expect(result).toBeNull();
  });

  it("should validate password with spaces", () => {
    const result = validatePassword("Valid Pass 123");
    expect(result).toBeNull();
  });

  it("should return first error when multiple conditions are not met", () => {
    const result = validatePassword("short");
    expect(result).toBeInstanceOf(Error);
    expect(result?.message).toBe("Password must be at least 8 characters long");
  });
});
