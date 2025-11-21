import { z } from "zod";
import { GameStatusEnum as gameStatusValues } from "@playloggd/domain";

export const addToCollectionSchema = z.object({
  gameExternalId: z.string().min(1, "Game ID is required"),
  status: z.enum(gameStatusValues, {
    message: "Invalid game status",
  }),
});

export const removeFromCollectionParamsSchema = z.object({
  gameExternalId: z.string().min(1, "Game ID is required"),
});

export const getCollectionParamsSchema = z.object({
  userId: z.uuid("User ID must be a valid UUID"),
});

export const getCollectionQuerySchema = z.object({
  status: z.enum(gameStatusValues).optional(),
});

export const updateGameStatusParamsSchema = z.object({
  gameExternalId: z.string().min(1, "Game ID is required"),
});

export const updateGameStatusBodySchema = z.object({
  status: z.enum(gameStatusValues, {
    message: "Invalid game status",
  }),
});
