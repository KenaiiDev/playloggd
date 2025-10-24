import { ConflictError, ValidationError } from "@/errors";
import { AuthService, UserService } from "@/services";

interface registerParams {
  dependencies: { userService: UserService; authService?: AuthService };
  payload: {
    username: string;
    email: string;
    password: string;
    bio?: string;
  };
}

export async function register({ dependencies, payload }: registerParams) {
  if (!payload.email) throw new ValidationError("Email is required");
  if (!payload.password) throw new ValidationError("Password is required");
  if (!payload.username) throw new ValidationError("Username is required");

  dependencies.authService?.validatePassword(payload.password);

  const existingUser = await dependencies.userService.getByEmail(payload.email);
  if (existingUser) throw new ConflictError("User already exist");

  const result = dependencies.userService.create({ ...payload });

  return result;
}
