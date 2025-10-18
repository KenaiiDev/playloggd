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
  if (!payload.userId) return new Error("User id is required");
  if (!payload.password) return new Error("Password is required");

  const user = await dependencies.userService.getById(payload.userId);
  if (!user) return new Error("No user found");
  const isPasswordValid = await dependencies.authService.verifyPassword(
    payload.password,
    user.passwordHash
  );
  if (!isPasswordValid) return new Error("Invalid password");

  const result = await dependencies.userService.deleteUser(payload.userId);
  return result;
}
