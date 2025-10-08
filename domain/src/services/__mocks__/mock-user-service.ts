import { mockDeep } from "vitest-mock-extended";
import type { UserService } from "../user-service";

export const createUserServiceMock = () => mockDeep<UserService>();
