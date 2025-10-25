import { ValidationError } from "../../errors";
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
  if (!payload.refreshToken)
    throw new ValidationError("Refresh token is required");

  const result = await dependencies.authService.refreshToken(
    payload.refreshToken
  );
  return result;
}
