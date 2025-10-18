import { mockDeep } from "vitest-mock-extended";
import type { GameEntryService } from "../game-entry-service";

export const createGameEntryServiceMock = () => mockDeep<GameEntryService>();
