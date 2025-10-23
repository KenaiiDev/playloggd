import { beforeEach } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";
import { validateSchema as middleware } from "../validate-schema";

const validateSchema = mockDeep<typeof middleware>();

beforeEach(() => {
  mockReset(validateSchema);
});

export { validateSchema };
