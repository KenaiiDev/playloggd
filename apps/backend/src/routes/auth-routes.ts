import { Router } from "express";

import { AuthController } from "@/controllers/auth-controller";
import { authenticate } from "@/middleware/authenticate";

export class AuthRoutes {
  public router: Router;

  constructor(private authController: AuthController) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.post("/auth/login", (req, res, next) =>
      this.authController.login(req, res, next)
    );

    this.router.put(
      "/auth/change-password/:id",
      authenticate,
      (req, res, next) => this.authController.changePassword(req, res, next)
    );

    this.router.post("/auth/refresh-token", (req, res, next) =>
      this.authController.refreshToken(req, res, next)
    );
  }
}
