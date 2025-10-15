import { beforeEach, describe, expect, it } from "vitest";
import { mockReset } from "vitest-mock-extended";

import { createAuthServiceMock } from "@/services/__mocks__/mock-auth-service";
import { refreshToken } from "./refresh-token";

describe("Refresh Token Use Case", () => {
  const authService = createAuthServiceMock();

  beforeEach(() => {
    mockReset(authService);
  });

  it("should refresh tokens successfully", async () => {
    const payload = {
      refreshToken: "valid-refresh-token",
    };

    const mockTokens = {
      accessToken: "new-access-token",
      refreshToken: "new-refresh-token",
      expiresIn: 86400,
      tokenType: "Bearer",
    };

    authService.refreshToken.mockResolvedValue(mockTokens);

    const result = await refreshToken({
      dependencies: { authService },
      payload,
    });

    expect(result).toEqual(mockTokens);
    expect(authService.refreshToken).toHaveBeenCalledWith(payload.refreshToken);
  });

  it("should return error when refresh token is empty", async () => {
    const payload = {
      refreshToken: "",
    };

    const result = await refreshToken({
      dependencies: { authService },
      payload,
    });

    expect(result).toBeInstanceOf(Error);
    expect(authService.refreshToken).not.toHaveBeenCalled();
  });

  it("should handle invalid refresh token", async () => {
    const payload = {
      refreshToken: "invalid-refresh-token",
    };

    const mockError = new Error("Invalid refresh token");
    authService.refreshToken.mockRejectedValue(mockError);

    const result = await refreshToken({
      dependencies: { authService },
      payload,
    });

    expect(result).toBe(mockError);
    expect(authService.refreshToken).toHaveBeenCalledWith(payload.refreshToken);
  });
});
