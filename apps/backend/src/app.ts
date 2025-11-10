import express, { type Express } from "express";
import cors from "cors";
import { errorHandler } from "./middleware/error-handler";
import { UserRoutes } from "./routes/user-routes";
import {
  buildUserController,
  buildAuthController,
  buildGameController,
} from "./config/";
import { AuthRoutes } from "./routes/auth-routes";
import { GameRoutes } from "./routes/game-routes";

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

app.use("/api", userRoutes.router);
app.use("/api", authRoutes.router);
app.use("/api", gameRoutes.router);

app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

app.use(errorHandler);
