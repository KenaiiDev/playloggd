import { AuthService } from "@/services";

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
  if (!payload.userId) return new Error("User id is required");

  if (!payload.currentPassword)
    return new Error("Current password is required");

  if (!payload.newPassword) return new Error("New password is required");
  const passwordError = dependencies.authService.validatePassword(
    payload.newPassword
  );
  if (passwordError) return passwordError;

  try {
    const result = await dependencies.authService.changePassword({
      userId: payload.userId,
      currentPassword: payload.currentPassword,
      newPassword: payload.newPassword,
    });

    return result;
  } catch (error) {
    return error instanceof Error
      ? error
      : new Error("An unexpected error occurred");
  }
}
