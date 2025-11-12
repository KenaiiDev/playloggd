import { Router } from "express";

import { GameController } from "@/controllers/game-controller";
import { validateParams, validateQuery } from "@/middleware/validate-schema";
import {
  getGameByIdSchema,
  getMostPopularGamesSchema,
  searchGamesSchema,
  getRecentReleaseGamesSchema,
  getTopRatedGamesSchema,
  getUpcomingGamesSchema,
  getGamesByFilterSchema,
} from "@/validations/game-schemas";

export class GameRoutes {
  public router: Router;

  constructor(private gameController: GameController) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes() {
    // Rutas específicas primero (antes de la ruta dinámica :gameId)
    this.router.get(
      "/games/search",
      validateQuery(searchGamesSchema),
      (req, res, next) => this.gameController.searchGames(req, res, next)
    );

    this.router.get(
      "/games/popular",
      validateQuery(getMostPopularGamesSchema),
      (req, res, next) =>
        this.gameController.getMostPopularGames(req, res, next)
    );

    this.router.get(
      "/games/recent",
      validateQuery(getRecentReleaseGamesSchema),
      (req, res, next) =>
        this.gameController.getRecentReleaseGames(req, res, next)
    );

    this.router.get(
      "/games/top",
      validateQuery(getTopRatedGamesSchema),
      (req, res, next) => this.gameController.getTopRatedGames(req, res, next)
    );

    this.router.get(
      "/games/upcoming",
      validateQuery(getUpcomingGamesSchema),
      (req, res, next) => this.gameController.getUpcomingGames(req, res, next)
    );

    this.router.get(
      "/games/filter",
      validateQuery(getGamesByFilterSchema),
      (req, res, next) => this.gameController.getByFilter(req, res, next)
    );

    this.router.get(
      "/games/:gameId",
      validateParams(getGameByIdSchema),
      (req, res, next) => this.gameController.getById(req, res, next)
    );
  }
}
