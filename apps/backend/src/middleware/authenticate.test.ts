import { describe, it, expect, vi, beforeEach } from "vitest";
import { authenticate } from "./authenticate";
import { accessTokenManager } from "@/adapters/jwt-adapter-instance";
import { createRequest, createResponse } from "node-mocks-http";
import { UnauthorizedError } from "@domain/errors";

describe("authenticate middleware", () => {
  let next: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    next = vi.fn();
    vi.resetAllMocks();
  });

  it("calls next and sets req.user if token is valid", () => {
    vi.spyOn(accessTokenManager, "verify").mockReturnValue({
      userId: "user-123",
    });
    const req = createRequest({
      headers: { authorization: "Bearer validtoken" },
    });
    const res = createResponse();
    authenticate(req, res, next);
    expect(req.user).toEqual({ id: "user-123" });
    expect(next).toHaveBeenCalled();
  });

  it("Should call next with error if token is missing", () => {
    const req = createRequest({ headers: {} });
    const res = createResponse();
    authenticate(req, res, next);
    expect(next).toHaveBeenCalledWith(
      new UnauthorizedError("No token provided")
    );
  });

  it("returns 401 if token is invalid", () => {
    vi.spyOn(accessTokenManager, "verify").mockReturnValue(null);
    const req = createRequest({
      headers: { authorization: "Bearer invalidtoken" },
    });
    const res = createResponse();
    authenticate(req, res, next);
    expect(next).toHaveBeenCalledWith(new UnauthorizedError("Invalid token"));
  });

  it("sets req.user with correct id from token payload", () => {
    vi.spyOn(accessTokenManager, "verify").mockReturnValue({
      userId: "abc-xyz",
    });
    const req = createRequest({
      headers: { authorization: "Bearer validtoken" },
    });
    const res = createResponse();
    authenticate(req, res, next);
    expect(req.user).toEqual({ id: "abc-xyz" });
    expect(next).toHaveBeenCalled();
  });

  it("handles malformed authorization header gracefully", () => {
    const req = createRequest({ headers: { authorization: "invalidheader" } });
    const res = createResponse();
    authenticate(req, res, next);
    expect(next).toHaveBeenCalledWith(
      new UnauthorizedError("No token provided")
    );
  });
});
