import { mockDeep } from "vitest-mock-extended";
import type { UserServiceImplementation } from "../user-service-implementation";

export const createUserServiceImplementationMocks = () =>
  mockDeep<UserServiceImplementation>();
