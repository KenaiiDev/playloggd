import { BcryptAdapter } from "@/adapters/bcrypt-adapter";
import {
  accessTokenManager,
  refreshTokenManager,
} from "@/adapters/jwt-adapter-instance";
import { AuthController } from "@/controllers/auth-controller";
import { AuthServiceImplementation } from "@/services/auth-service-implementation";
import { UserServiceImplementation } from "@/services/user-service-implementation";
import { PrismaClient } from "@prisma/client";

export function buildAuthController() {
  const prisma = new PrismaClient();
  const passwordHasher = new BcryptAdapter();
  const userService = new UserServiceImplementation(prisma, passwordHasher);

  const authService = new AuthServiceImplementation(
    passwordHasher,
    accessTokenManager,
    refreshTokenManager,
    userService
  );

  return new AuthController(userService, authService);
}
