import { Router } from "express";

import { UserController } from "@/controllers/user-controller";
import { authenticate } from "@/middleware/authenticate";

import { validateBody, validateParams } from "@/middleware/validate-schema";
import {
  registerUserSchema,
  deleteUserSchema,
  getUserByEmailSchema,
  getUserByIdSchema,
  updateUserSchema,
  updateUserIdSchema,
} from "@/validations/user-schemas";

export class UserRoutes {
  public router: Router;

  constructor(private userController: UserController) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.post(
      "/users",
      validateBody(registerUserSchema),
      (req, res, next) => this.userController.register(req, res, next)
    );

    this.router.get(
      "/users/:id",
      validateParams(getUserByIdSchema),
      (req, res, next) => this.userController.getUserById(req, res, next)
    );

    this.router.get(
      "/users/email/:email",
      validateParams(getUserByEmailSchema),
      (req, res, next) => this.userController.getUserByEmail(req, res, next)
    );

    this.router.put(
      "/users/:id",
      validateBody(updateUserSchema),
      validateParams(updateUserIdSchema),
      (req, res, next) => this.userController.updateUser(req, res, next)
    );

    this.router.delete(
      "/users/:id",
      validateParams(deleteUserSchema),
      authenticate,
      (req, res, next) => this.userController.deleteUser(req, res, next)
    );
  }
}
