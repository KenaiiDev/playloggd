import { BcryptAdapter } from "@/adapters/bcrypt-adapter";
import { JwtAdapter } from "@/adapters/jwt-adapter";
import { UserController } from "@/controllers/user-controller";
import { AuthServiceImplementation } from "@/services/auth-service-implementation";
import { UserServiceImplementation } from "@/services/user-service-implementation";
import { PrismaClient } from "@prisma/client";

export function buildUserController() {
  const prisma = new PrismaClient();
  const passwordHasher = new BcryptAdapter();
  const userService = new UserServiceImplementation(prisma, passwordHasher);

  if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_ACCESS_EXPIRES) {
    throw new Error(
      "Environment variables JWT_ACCESS_SECRET and JWT_ACCESS_EXPIRES must be defined"
    );
  }

  if (!process.env.JWT_REFRESH_SECRET || !process.env.JWT_REFRESH_EXPIRES) {
    throw new Error(
      "Environment variables JWT_REFRESH_SECRET and JWT_REFRESH_EXPIRES must be defined"
    );
  }

  const accessTokenManager = new JwtAdapter(
    process.env.JWT_ACCESS_SECRET!,
    process.env.JWT_ACCESS_EXPIRES!
  );
  const refreshTokenManager = new JwtAdapter(
    process.env.JWT_REFRESH_SECRET!,
    process.env.JWT_REFRESH_EXPIRES!
  );

  const authService = new AuthServiceImplementation(
    passwordHasher,
    accessTokenManager,
    refreshTokenManager,
    userService
  );

  return new UserController(userService, authService);
}
