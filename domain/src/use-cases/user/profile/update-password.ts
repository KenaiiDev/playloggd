import { UserService } from "@/services/user-service";
import { AuthService } from "@/services/auth-service";

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

  if (!userId.trim()) return new Error("User ID is required");
  if (!currentPassword.trim()) return new Error("Current password is required");
  if (!newPassword.trim()) return new Error("New password is required");
  if (dependencies.authService.validatePassword(newPassword)) {
    return new Error("New password does not meet security requirements");
  }

  const user = await dependencies.userService.getById(userId);
  if (!user) {
    return new Error("User not found");
  }

  const isPasswordValid = await dependencies.authService.verifyPassword(
    currentPassword,
    user.passwordHash
  );
  if (!isPasswordValid) {
    return new Error("Current password is incorrect");
  }

  const updated = await dependencies.userService.updatePassword(
    userId,
    newPassword
  );
  if (!updated) {
    return new Error("Failed to update password");
  }

  return true;
}
