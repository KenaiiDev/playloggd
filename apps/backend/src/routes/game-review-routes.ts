import { Router } from "express";

import { GameReviewController } from "@/controllers/game-review-controller";
import { authenticate } from "@/middleware/authenticate";
import { validateBody, validateParams } from "@/middleware/validate-schema";
import {
  createReviewSchema,
  deleteReviewParamsSchema,
  getGameReviewsParamsSchema,
  getUserReviewsParamsSchema,
  updateReviewBodySchema,
  updateReviewParamsSchema,
} from "@/validations/game-review-schema";

export class GameReviewRoutes {
  public router: Router;

  constructor(private gameReviewController: GameReviewController) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.post(
      "/game-review",
      validateBody(createReviewSchema),
      authenticate,
      (req, res, next) => this.gameReviewController.createReview(req, res, next)
    );

    this.router.put(
      "/game-review/:reviewId",
      validateParams(updateReviewParamsSchema),
      validateBody(updateReviewBodySchema),
      authenticate,
      (req, res, next) => this.gameReviewController.updateReview(req, res, next)
    );

    this.router.delete(
      "/game-review/:reviewId",
      validateParams(deleteReviewParamsSchema),
      authenticate,
      (req, res, next) => this.gameReviewController.deleteReview(req, res, next)
    );

    this.router.get(
      "/game-review/game/:gameId",
      validateParams(getGameReviewsParamsSchema),
      (req, res, next) =>
        this.gameReviewController.getGameReviews(req, res, next)
    );

    this.router.get(
      "/game-review/user/:userId",
      validateParams(getUserReviewsParamsSchema),
      (req, res, next) =>
        this.gameReviewController.getUserReviews(req, res, next)
    );
  }
}
