import { Router } from "express";

import { UserController } from "@/controllers/user-controller";
import { authenticate } from "@/middleware/authenticate";

export class UserRoutes {
  public router: Router;

  constructor(private userController: UserController) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.post("/users", (req, res, next) =>
      this.userController.register(req, res, next)
    );

    this.router.get("/users/:id", (req, res, next) =>
      this.userController.getUserById(req, res, next)
    );
    this.router.get("/users/email/:email", (req, res, next) =>
      this.userController.getUserByEmail(req, res, next)
    );

    this.router.put("/users/:id", (req, res, next) =>
      this.userController.updateUser(req, res, next)
    );

    this.router.delete("/users/:id", authenticate, (req, res, next) =>
      this.userController.deleteUser(req, res, next)
    );
  }
}
