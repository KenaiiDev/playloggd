import { mockDeep } from "vitest-mock-extended";
import type { GameReviewService } from "../game-review-service";

export const createGameReviewServiceMock = () => mockDeep<GameReviewService>();
