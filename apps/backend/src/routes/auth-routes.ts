import { Router } from "express";

import { AuthController } from "@/controllers/auth-controller";
import { authenticate } from "@/middleware/authenticate";

import {
  changePasswordParamsSchema,
  changePasswordSchema,
  loginSchema,
  refreshTokenSchema,
} from "@/validations/auth-schemas";
import { validateBody, validateParams } from "@/middleware/validate-schema";

export class AuthRoutes {
  public router: Router;

  constructor(private authController: AuthController) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.post(
      "/auth/login",
      validateBody(loginSchema),
      (req, res, next) => this.authController.login(req, res, next)
    );

    this.router.put(
      "/auth/change-password/:id",
      validateParams(changePasswordParamsSchema),
      validateBody(changePasswordSchema),
      authenticate,
      (req, res, next) => this.authController.changePassword(req, res, next)
    );

    this.router.post(
      "/auth/refresh-token",
      validateBody(refreshTokenSchema),
      (req, res, next) => this.authController.refreshToken(req, res, next)
    );
  }
}
