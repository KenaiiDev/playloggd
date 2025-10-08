import { UserService } from "@/services/user-service";

interface getUsersParams {
  dependencies: { userService: UserService };
  payload: { id?: string; email?: string };
}

export async function getUsers({ dependencies, payload }: getUsersParams) {
  if (!payload?.id || !payload.id.trim())
    return new Error("User ID is required");

  const result = await dependencies.userService.getById(payload.id);
  return result;
}

export async function getUsersByEmail({
  dependencies,
  payload,
}: getUsersParams) {
  if (!payload?.email || !payload.email.trim())
    return new Error("User email is required");

  const result = await dependencies.userService.getByEmail(payload.email);
  return result;
}
