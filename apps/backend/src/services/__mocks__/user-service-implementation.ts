import { beforeEach } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";
import type { UserServiceImplementation as service } from "../user-service-implementation";

const UserServiceImplementation = mockDeep<service>();

beforeEach(() => {
  mockReset(UserServiceImplementation);
});

export { UserServiceImplementation };
