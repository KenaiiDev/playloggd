import { User } from "@/entities";
import { ValidationError } from "@/errors";
import { UserService } from "@/services";

interface updateProfileParams {
  dependencies: {
    userService: UserService;
  };
  payload: {
    user: string;
    data: Partial<
      Omit<User, "id" | "createdAt" | "updatedAt" | "passwordHash">
    > & {
      password?: string;
    };
  };
}

export async function updateProfile({
  dependencies,
  payload,
}: updateProfileParams) {
  if (!payload.user.trim()) throw new ValidationError("User email is required");
  if (!payload.data || Object.keys(payload.data).length === 0)
    throw new ValidationError("New data is required");

  const result = dependencies.userService.update(payload);

  return result;
}
