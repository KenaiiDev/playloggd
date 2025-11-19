import { httpResponse } from "@/utils/http-response";
import {
  addToCollection,
  GameEntryService,
  GameService,
  GameStatus,
  getCollection,
  removeFromCollection,
  updateGameStatus,
  ValidationError,
} from "@playloggd/domain";
import { NextFunction, Request, Response } from "express";

export class GameEntryController {
  private gameEntryService: GameEntryService;
  private gameService: GameService;

  constructor(gameEntryService: GameEntryService, gameService: GameService) {
    this.gameEntryService = gameEntryService;
    this.gameService = gameService;
  }

  async addToCollection(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ValidationError("User not authenticated");
      }

      const result = await addToCollection({
        dependencies: {
          userGameService: this.gameEntryService,
        },
        payload: {
          gameExternalId: req.body.gameExternalId,
          status: req.body.status,
          userId: req.user.id,
        },
      });

      return httpResponse.CREATED(res, result);
    } catch (error) {
      next(error);
    }
  }

  async removeFromCollection(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ValidationError("User not authenticated");
      }

      await removeFromCollection({
        dependencies: {
          userGameService: this.gameEntryService,
        },
        payload: {
          gameExternalId: req.params.gameExternalId,
          userId: req.user.id,
        },
      });

      return httpResponse.NO_CONTENT(res);
    } catch (error) {
      next(error);
    }
  }

  async getCollection(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await getCollection({
        dependencies: {
          userGameService: this.gameEntryService,
          gameService: this.gameService,
        },
        payload: {
          userId: req.params.userId,
          status: req.query.status as GameStatus | undefined,
        },
      });

      return httpResponse.OK(res, result);
    } catch (error) {
      next(error);
    }
  }

  async updateGameStatus(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new ValidationError("User not authenticated");

      const result = await updateGameStatus({
        dependencies: {
          userGameService: this.gameEntryService,
        },
        payload: {
          userId: req.user.id,
          gameExternalId: req.params.gameExternalId,
          status: req.body.status,
        },
      });

      return httpResponse.OK(res, result);
    } catch (error) {
      next(error);
    }
  }
}
