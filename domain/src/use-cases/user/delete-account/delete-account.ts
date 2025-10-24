import {
  NotFoundError,
  PasswordValidationError,
  ValidationError,
} from "@/errors";
import { UserService } from "@/services";
import { AuthService } from "@/services";

interface DeleteAccountProps {
  dependencies: {
    userService: UserService;
    authService: AuthService;
  };
  payload: {
    userId: string;
    password: string;
  };
}

export async function deleteAccount({
  dependencies,
  payload,
}: DeleteAccountProps) {
  if (!payload.userId) throw new ValidationError("User id is required");
  if (!payload.password) throw new ValidationError("Password is required");

  const user = await dependencies.userService.getById(payload.userId);
  if (!user) throw new NotFoundError("No user found");
  const isPasswordValid = await dependencies.authService.verifyPassword(
    payload.password,
    user.passwordHash
  );
  if (!isPasswordValid) throw new PasswordValidationError("Invalid password");

  const result = await dependencies.userService.deleteUser(payload.userId);
  return result;
}
