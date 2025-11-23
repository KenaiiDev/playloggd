import { NextFunction, Request, Response } from "express";
import {
  getGameByFilter,
  getGameDetails,
  getMostPopularGames,
  getRecentReleaseGames,
  getTopRatedGames,
  getUpcomingGames,
  searchGame,
  GameService,
} from "@playloggd/domain";

import { httpResponse } from "@/utils/http-response";

export class GameController {
  private gameService: GameService;

  constructor(gameService: GameService) {
    this.gameService = gameService;
  }

  private mapQueryParamsToDomain(query: { limit: string; offset: string }): {
    limit: number;
    offset: number;
  } {
    return {
      limit: parseInt(query.limit),
      offset: parseInt(query.offset),
    };
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
      const paginationParams = this.mapQueryParamsToDomain({
        limit: req.query.limit as string,
        offset: req.query.offset as string,
      });

      const result = await searchGame({
        dependencies: {
          gameService: this.gameService,
        },
        payload: {
          query: req.query.q as string,
          pagination: paginationParams,
        },
      });

      return res.status(200).json({
        status: 200,
        statusMsg: "Success",
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMostPopularGames(req: Request, res: Response, next: NextFunction) {
    try {
      const paginationParams = this.mapQueryParamsToDomain({
        limit: req.query.limit as string,
        offset: req.query.offset as string,
      });
      const result = await getMostPopularGames({
        dependencies: {
          gameService: this.gameService,
        },
        payload: {
          pagination: paginationParams,
        },
      });

      return res.status(200).json({
        status: 200,
        statusMsg: "Success",
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTopRatedGames(req: Request, res: Response, next: NextFunction) {
    try {
      const paginationParams = this.mapQueryParamsToDomain({
        limit: req.query.limit as string,
        offset: req.query.offset as string,
      });
      const result = await getTopRatedGames({
        dependencies: {
          gameService: this.gameService,
        },
        payload: {
          pagination: paginationParams,
        },
      });

      return res.status(200).json({
        status: 200,
        statusMsg: "Success",
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUpcomingGames(req: Request, res: Response, next: NextFunction) {
    try {
      const paginationParams = this.mapQueryParamsToDomain({
        limit: req.query.limit as string,
        offset: req.query.offset as string,
      });
      const result = await getUpcomingGames({
        dependencies: {
          gameService: this.gameService,
        },
        payload: {
          pagination: paginationParams,
        },
      });

      return res.status(200).json({
        status: 200,
        statusMsg: "Success",
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getRecentReleaseGames(req: Request, res: Response, next: NextFunction) {
    try {
      const paginationParams = this.mapQueryParamsToDomain({
        limit: req.query.limit as string,
        offset: req.query.offset as string,
      });
      const result = await getRecentReleaseGames({
        dependencies: {
          gameService: this.gameService,
        },
        payload: {
          pagination: paginationParams,
        },
      });

      return res.status(200).json({
        status: 200,
        statusMsg: "Success",
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getByFilter(req: Request, res: Response, next: NextFunction) {
    try {
      const { genres, platforms, limit, offset, ...otherFilters } = req.query;
      const filter = {
        genres: genres ? [genres as string] : undefined,
        platforms: platforms ? [platforms as string] : undefined,
        ...otherFilters,
      };

      const paginationParams = this.mapQueryParamsToDomain({
        limit: limit as string,
        offset: offset as string,
      });

      const result = await getGameByFilter({
        dependencies: {
          gameService: this.gameService,
        },
        payload: {
          filter,
          pagination: paginationParams,
        },
      });

      return res.status(200).json({
        status: 200,
        statusMsg: "Success",
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }
}
