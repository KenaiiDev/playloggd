import { beforeEach } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";
import type { GameServiceImplementation as service } from "../game-service-implementation";

const GameServiceImplementation = mockDeep<service>();

beforeEach(() => {
  mockReset(GameServiceImplementation);
});

export { GameServiceImplementation };
