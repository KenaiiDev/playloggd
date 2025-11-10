import { NextFunction, Request, Response } from "express";
import {
  getGameByFilter,
  getGameDetails,
  getMostPopularGames,
  getRecentReleaseGames,
  getTopRatedGames,
  getUpcomingGames,
  searchGame,
} from "@playloggd/domain";

import { GameServiceImplementation } from "@/services/game-service-implementation";
import { httpResponse } from "@/utils/http-response";

export class GameController {
  private gameService: GameServiceImplementation;

  constructor(gameService: GameServiceImplementation) {
    this.gameService = gameService;
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await getGameDetails({
        dependencies: {
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

  async searchGames(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await searchGame({
        dependencies: {
          gameService: this.gameService,
        },
        payload: {
          query: req.query.q as string,
        },
      });

      return httpResponse.OK(res, result);
    } catch (error) {
      next(error);
    }
  }

  async getMostPopularGames(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await getMostPopularGames({
        dependencies: {
          gameService: this.gameService,
        },
        payload: {
          limit,
        },
      });

      return httpResponse.OK(res, result);
    } catch (error) {
      next(error);
    }
  }

  async getTopRatedGames(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await getTopRatedGames({
        dependencies: {
          gameService: this.gameService,
        },
        payload: {
          limit,
        },
      });

      return httpResponse.OK(res, result);
    } catch (error) {
      next(error);
    }
  }

  async getUpcomingGames(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await getUpcomingGames({
        dependencies: {
          gameService: this.gameService,
        },
        payload: {
          limit,
        },
      });

      return httpResponse.OK(res, result);
    } catch (error) {
      next(error);
    }
  }

  async getRecentReleaseGames(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await getRecentReleaseGames({
        dependencies: {
          gameService: this.gameService,
        },
        payload: {
          limit,
        },
      });

      return httpResponse.OK(res, result);
    } catch (error) {
      next(error);
    }
  }

  async getByFilter(req: Request, res: Response, next: NextFunction) {
    try {
      const { genres, platforms, ...otherFilters } = req.query;
      const filter = {
        genres: genres ? [genres as string] : undefined,
        platforms: platforms ? [platforms as string] : undefined,
        ...otherFilters,
      };

      const result = await getGameByFilter({
        dependencies: {
          gameService: this.gameService,
        },
        payload: {
          filter,
        },
      });

      return httpResponse.OK(res, result);
    } catch (error) {
      next(error);
    }
  }
}
