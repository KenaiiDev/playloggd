import { UserService } from "@/services/user-service";
import { AuthService } from "@/services/auth-service";
import {
  ConflictError,
  NotFoundError,
  PasswordValidationError,
  ValidationError,
} from "@/errors";

interface UpdatePasswordParams {
  dependencies: {
    userService: UserService;
    authService: AuthService;
  };
  payload: {
    userId: string;
    currentPassword: string;
    newPassword: string;
  };
}

export async function updatePassword({
  dependencies,
  payload,
}: UpdatePasswordParams) {
  const { userId, currentPassword, newPassword } = payload;

  if (!userId.trim()) throw new ValidationError("User ID is required");
  if (!currentPassword.trim())
    throw new ValidationError("Current password is required");
  if (!newPassword.trim())
    throw new ValidationError("New password is required");
  dependencies.authService.validatePassword(newPassword);

  const user = await dependencies.userService.getById(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  const isPasswordValid = await dependencies.authService.verifyPassword(
    currentPassword,
    user.passwordHash
  );
  if (!isPasswordValid) {
    throw new PasswordValidationError("Current password is incorrect");
  }

  const updated = await dependencies.userService.updatePassword(
    userId,
    newPassword
  );
  if (!updated) {
    throw new ConflictError("Failed to update password");
  }

  return true;
}
