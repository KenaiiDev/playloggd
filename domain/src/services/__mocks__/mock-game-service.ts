import { mockDeep } from "vitest-mock-extended";
import type { GameService } from "../game-service";

export const createGameServiceMock = () => mockDeep<GameService>();
