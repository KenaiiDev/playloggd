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
  if (!payload.email) return new Error("Email is required");
  if (!payload.password) return new Error("Password is required");

  const user = await dependencies.userService.getByEmail(payload.email);
  if (!user) return new Error("No user found");

  const isPasswordValid = await dependencies.authService.verifyPassword(
    payload.password,
    user.passwordHash
  );
  if (!isPasswordValid) return new Error("Invalid password");

  const token = await dependencies.authService.generateToken(user?.id);

  return {
    token,
    expiresIn: 86400,
    tokenType: "Bearer",
  };
}
