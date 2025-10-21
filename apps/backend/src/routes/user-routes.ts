import { Router } from "express";
import { UserController } from "../controllers/user-controller";
import { UserServiceImplementation } from "../services/user-service-implementation";
import { PrismaClient } from "@prisma/client";
import { BcryptAdapter } from "../adapters/bcrypt-adapter";
import { AuthServiceImplementation } from "@/services/auth-service-implementation";
import { JwtAdapter } from "@/adapters/jwt-adapter";

const router = Router();
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

const accessSecret = process.env.JWT_ACCESS_SECRET;
const accessExpires = process.env.JWT_ACCESS_EXPIRES;

const refreshSecret = process.env.JWT_REFRESH_SECRET;
const refreshExpires = process.env.JWT_REFRESH_EXPIRES;

const accessTokenManager = new JwtAdapter(accessSecret, accessExpires);
const refreshTokenManager = new JwtAdapter(refreshSecret, refreshExpires);

const authService = new AuthServiceImplementation(
  passwordHasher,
  accessTokenManager,
  refreshTokenManager,
  userService
);

const userController = new UserController(userService, authService);

// Define routes
router.post("/users", (req, res, next) =>
  userController.register(req, res, next)
);
router.get("/users/:id", (req, res, next) =>
  userController.getUserById(req, res, next)
);
router.get("/users/email/:email", (req, res, next) =>
  userController.getUserByEmail(req, res, next)
);
router.put("/users/:id", (req, res, next) =>
  userController.updateUser(req, res, next)
);
router.delete("/users/:id", (req, res, next) =>
  userController.deleteUser(req, res, next)
);

export default router;
