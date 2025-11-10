import { z } from "zod";

export const getGameByIdSchema = z.object({
  gameId: z.string().min(1, "Game ID is required"),
});

export const searchGamesSchema = z.object({
  q: z.string().min(2, "Search query must be at least 2 characters long"),
});

const limitQuerySchema = z.object({
  limit: z
    .string()
    .regex(/^\d+$/, "Limit must be a number")
    .transform(Number)
    .refine((n) => n > 0, "Limit must be greater than 0")
    .optional()
    .transform((val) => val ?? 10),
});

export const getMostPopularGamesSchema = limitQuerySchema;
export const getTopRatedGamesSchema = limitQuerySchema;
export const getUpcomingGamesSchema = limitQuerySchema;
export const getRecentReleaseGamesSchema = limitQuerySchema;

export const getGamesByFilterSchema = z.object({
  genres: z.string().min(1, "Genre must not be empty").array().optional(),
  platforms: z.string().min(1, "Platform must not be empty").array().optional(),
  limit: z
    .string()
    .regex(/^\d+$/, "Limit must be a number")
    .transform(Number)
    .refine((n) => n > 0, "Limit must be greater than 0")
    .optional()
    .transform((val) => val ?? 10),
  sortBy: z.enum(["rating", "releaseDate", "title"]).optional(),
  sortOrder: z
    .enum(["asc", "desc"])
    .optional()
    .transform((val) => val ?? "desc"),
});
