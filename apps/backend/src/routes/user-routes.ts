import { Router } from "express";
import { UserController } from "../controllers/user-controller";
import { UserServiceImplementation } from "../services/user-service-implementation";
import { PrismaClient } from "@prisma/client";
import { BcryptAdapter } from "../adapters/bcrypt-adapter";

const router = Router();
const prisma = new PrismaClient();
const passwordHasher = new BcryptAdapter();
const userService = new UserServiceImplementation(prisma, passwordHasher);
const userController = new UserController(userService);

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
