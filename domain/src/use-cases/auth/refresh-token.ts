import { AuthService } from "@/services";

interface RefreshTokenProps {
  dependencies: {
    authService: AuthService;
  };
  payload: {
    refreshToken: string;
  };
}

export async function refreshToken({
  dependencies,
  payload,
}: RefreshTokenProps) {
  if (!payload.refreshToken) return new Error("Refresh token is required");

  try {
    const result = await dependencies.authService.refreshToken(
      payload.refreshToken
    );
    return result;
  } catch (error) {
    return error instanceof Error ? error : new Error("Invalid refresh token");
  }
}
