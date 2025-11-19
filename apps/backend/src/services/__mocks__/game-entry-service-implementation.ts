import { beforeEach } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";
import type { GameEntryServiceImplementation as service } from "../game-entry-service-implementation";

const GameEntryServiceImplementation = mockDeep<service>();

beforeEach(() => {
  mockReset(GameEntryServiceImplementation);
});

export { GameEntryServiceImplementation };
