import { beforeEach } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";
import type { UserController as controller } from "../user-controller";

const UserController = mockDeep<controller>();

beforeEach(() => {
  mockReset(UserController);
});

export { UserController };
