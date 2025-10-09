import { mockDeep } from "vitest-mock-extended";
import type { AuthService } from "../auth-service";

export const createAuthServiceMock = () => mockDeep<AuthService>();
