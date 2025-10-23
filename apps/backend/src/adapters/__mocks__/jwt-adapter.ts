import { beforeEach } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";
import type { JwtAdapter as adapter } from "../jwt-adapter";

const JwtAdapter = mockDeep<adapter>();

beforeEach(() => {
  mockReset(JwtAdapter);
});

export { JwtAdapter };
