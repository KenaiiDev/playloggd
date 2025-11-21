import express, { type Express } from "express";
import cors from "cors";
import { errorHandler } from "./middleware/error-handler";
import { UserRoutes } from "./routes/user-routes";
import {
  buildUserController,
  buildAuthController,
  buildGameController,
  buildGameEntryController,
  buildGameReviewController,
} from "./config/";
import { AuthRoutes } from "./routes/auth-routes";
import { GameRoutes } from "./routes/game-routes";
import { GameEntryRoutes } from "./routes/game-entry-routes";
import { GameReviewRoutes } from "./routes/game-review-routes";

export const app: Express = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

const userController = buildUserController();
const userRoutes = new UserRoutes(userController);

const authController = buildAuthController();
const authRoutes = new AuthRoutes(authController);

const gameController = buildGameController();
const gameRoutes = new GameRoutes(gameController);

const gameEntryController = buildGameEntryController();
const gameEntryRoutes = new GameEntryRoutes(gameEntryController);

const gameReviewController = buildGameReviewController();
const gameReviewRoutes = new GameReviewRoutes(gameReviewController);

app.use("/api", userRoutes.router);
app.use("/api", authRoutes.router);
app.use("/api", gameRoutes.router);
app.use("/api", gameEntryRoutes.router);
app.use("/api", gameReviewRoutes.router);

app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

app.use(errorHandler);
