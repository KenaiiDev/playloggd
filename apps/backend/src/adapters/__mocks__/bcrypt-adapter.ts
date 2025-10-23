import { beforeEach } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";
import type { BcryptAdapter as adapter } from "../bcrypt-adapter";

const BcryptAdapter = mockDeep<adapter>();

beforeEach(() => {
  mockReset(BcryptAdapter);
});

export { BcryptAdapter };
