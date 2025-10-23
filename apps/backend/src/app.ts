import express from "express";
import cors from "cors";
import { errorHandler } from "./middleware/error-handler";
import { UserRoutes } from "./routes/user-routes";
import { buildUserController } from "./config/user-dependencies";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

const userController = buildUserController();
const userRoutes = new UserRoutes(userController);

app.use("/api", userRoutes.router);

app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

app.use(errorHandler);
