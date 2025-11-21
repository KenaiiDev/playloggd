import { Router } from "express";

import { GameEntryController } from "@/controllers/game-entry-controller";
import { authenticate } from "@/middleware/authenticate";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "@/middleware/validate-schema";
import {
  addToCollectionSchema,
  getCollectionParamsSchema,
  getCollectionQuerySchema,
  removeFromCollectionParamsSchema,
  updateGameStatusBodySchema,
  updateGameStatusParamsSchema,
} from "@/validations/game-entry-schemas";

export class GameEntryRoutes {
  public router: Router;

  constructor(private gameEntryController: GameEntryController) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.post(
      "/game-entry",
      validateBody(addToCollectionSchema),
      authenticate,
      (req, res, next) =>
        this.gameEntryController.addToCollection(req, res, next)
    );

    this.router.delete(
      "/game-entry/delete/:gameExternalId",
      validateParams(removeFromCollectionParamsSchema),
      authenticate,
      (req, res, next) =>
        this.gameEntryController.removeFromCollection(req, res, next)
    );

    this.router.get(
      "/game-entries/:userId",
      validateParams(getCollectionParamsSchema),
      validateQuery(getCollectionQuerySchema),
      (req, res, next) => this.gameEntryController.getCollection(req, res, next)
    );

    this.router.put(
      "/game-entry/update/:gameExternalId",
      validateBody(updateGameStatusBodySchema),
      validateParams(updateGameStatusParamsSchema),
      authenticate,
      (req, res, next) =>
        this.gameEntryController.updateGameStatus(req, res, next)
    );
  }
}
