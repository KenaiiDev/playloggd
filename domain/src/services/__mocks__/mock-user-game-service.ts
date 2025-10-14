import { mockDeep } from "vitest-mock-extended";
import type { UserGameService } from "../user-game-service";

export const createUserGameServiceMock = () => mockDeep<UserGameService>();
