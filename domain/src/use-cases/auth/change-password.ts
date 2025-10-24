import { AuthService } from "@/services";
import { ValidationError } from "@/errors/errors";

interface ChangePasswordProps {
  dependencies: {
    authService: AuthService;
  };
  payload: {
    userId: string;
    currentPassword: string;
    newPassword: string;
  };
}

export async function changePassword({
  dependencies,
  payload,
}: ChangePasswordProps): Promise<boolean | Error> {
  if (!payload.userId) throw new ValidationError("User id is required");

  if (!payload.currentPassword)
    throw new ValidationError("Current password is required");

  if (!payload.newPassword)
    throw new ValidationError("New password is required");

  dependencies.authService.validatePassword(payload.newPassword);

  const result = await dependencies.authService.changePassword({
    userId: payload.userId,
    currentPassword: payload.currentPassword,
    newPassword: payload.newPassword,
  });

  return result;
}
