import { httpResponse } from "@/utils/http-response";
import {
  createReview,
  deleteReview,
  GameReviewService,
  GameService,
  getGameReviews,
  getUserReviews,
  updateReview,
  UserService,
  ValidationError,
} from "@playloggd/domain";
import { NextFunction, Request, Response } from "express";

export class GameReviewController {
  private gameReviewService: GameReviewService;
  private gameService: GameService;
  private userService: UserService;

  constructor(
    gameReviewService: GameReviewService,
    gameService: GameService,
    userService: UserService
  ) {
    this.gameReviewService = gameReviewService;
    this.gameService = gameService;
    this.userService = userService;
  }

  async createReview(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new ValidationError("User not authenticated");

      const result = await createReview({
        dependencies: {
          gameReviewService: this.gameReviewService,
          gameService: this.gameService,
          userService: this.userService,
        },
        payload: {
          ...req.body,
          userId: req.user?.id,
        },
      });
      return httpResponse.CREATED(res, result);
    } catch (error) {
      next(error);
    }
  }

  async updateReview(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new ValidationError("User not authenticated");
      const result = await updateReview({
        dependencies: {
          gameReviewService: this.gameReviewService,
          gameService: this.gameService,
          userService: this.userService,
        },
        payload: {
          ...req.body,
          reviewId: req.params.reviewId,
        },
      });

      return httpResponse.OK(res, result);
    } catch (error) {
      next(error);
    }
  }

  async deleteReview(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new ValidationError("User not authenticated");

      await deleteReview({
        dependencies: {
          gameReviewService: this.gameReviewService,
          userService: this.userService,
        },
        payload: {
          reviewId: req.params.reviewId,
          userId: req.user.id,
        },
      });

      return httpResponse.NO_CONTENT(res);
    } catch (error) {
      next(error);
    }
  }

  async getGameReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await getGameReviews({
        dependencies: {
          gameReviewService: this.gameReviewService,
          gameService: this.gameService,
        },
        payload: {
          gameId: req.params.gameId,
        },
      });

      return httpResponse.OK(res, result);
    } catch (error) {
      next(error);
    }
  }

  async getUserReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await getUserReviews({
        dependencies: {
          gameReviewService: this.gameReviewService,
          userService: this.userService,
        },
        payload: {
          userId: req.params.userId,
        },
      });

      return httpResponse.OK(res, result);
    } catch (error) {
      next(error);
    }
  }
}
