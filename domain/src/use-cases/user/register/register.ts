import { UserService } from "@/services";
import { validatePassword } from "@/utils";
interface registerParams {
  dependencies: { userService: UserService };
  payload: {
    username: string;
    email: string;
    password: string;
    bio?: string;
  };
}

export async function register({ dependencies, payload }: registerParams) {
  if (!payload.email) return new Error("Email is required");
  if (!payload.password) return new Error("Password is required");
  if (!payload.username) return new Error("Username is required");

  const passwordError = validatePassword(payload.password);
  if (passwordError) return new Error(passwordError.message);

  const existingUser = await dependencies.userService.getByEmail(payload.email);
  if (existingUser) return new Error();

  const result = dependencies.userService.create({ ...payload });

  return result;
}
