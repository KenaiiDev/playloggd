import { beforeEach } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";
import type { GameReviewServiceImplementation as service } from "../game-review-service-implementation";

const GameReviewServiceImplementation = mockDeep<service>();

beforeEach(() => {
  mockReset(GameReviewServiceImplementation);
});

export { GameReviewServiceImplementation };
