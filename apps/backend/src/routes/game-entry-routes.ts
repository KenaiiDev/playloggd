import { Router } from "express";

import { GameEntryController } from "@/controllers/game-entry-controller";
import { authenticate } from "@/middleware/authenticate";

export class GameEntryRoutes {
  public router: Router;

  constructor(private gameEntryController: GameEntryController) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.post("/game-entry", authenticate, (req, res, next) =>
      this.gameEntryController.addToCollection(req, res, next)
    );

    this.router.delete(
      "/game-entry/delete/:gameExternalId",
      authenticate,
      (req, res, next) =>
        this.gameEntryController.removeFromCollection(req, res, next)
    );

    this.router.get("/game-entries/:userId", (req, res, next) =>
      this.gameEntryController.getCollection(req, res, next)
    );

    this.router.put(
      "/game-entry/update/:gameExternalId",
      authenticate,
      (req, res, next) =>
        this.gameEntryController.updateGameStatus(req, res, next)
    );
  }
}
