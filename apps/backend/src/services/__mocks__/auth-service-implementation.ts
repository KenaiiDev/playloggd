import { beforeEach } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";
import type { AuthServiceImplementation as service } from "../auth-service-implementation";

const AuthServiceImplementation = mockDeep<service>();

beforeEach(() => {
  mockReset(AuthServiceImplementation);
});

export { AuthServiceImplementation };
