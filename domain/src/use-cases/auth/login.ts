import {
  PasswordValidationError,
  ValidationError,
  NotFoundError,
} from "@/errors";
import { UserService, AuthService } from "@/services";

interface loginParams {
  dependencies: {
    userService: UserService;
    authService: AuthService;
  };
  payload: {
    email: string;
    password: string;
  };
}

export async function login({ dependencies, payload }: loginParams) {
  if (!payload.email) throw new ValidationError("Email is required");
  if (!payload.password) throw new ValidationError("Password is required");

  const user = await dependencies.userService.getByEmail(payload.email);
  if (!user) throw new NotFoundError("No user found");

  const isPasswordValid = await dependencies.authService.verifyPassword(
    payload.password,
    user.passwordHash
  );
  if (!isPasswordValid) throw new PasswordValidationError("Invalid password");

  const token = await dependencies.authService.generateToken(user?.id);

  return {
    ...token,
  };
}
