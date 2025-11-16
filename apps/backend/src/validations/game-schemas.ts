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
  genres: z
    .union([z.string(), z.array(z.string())])
    .transform((val) => (Array.isArray(val) ? val : [val]))
    .optional(),
  platforms: z
    .union([z.string(), z.array(z.string())])
    .transform((val) => (Array.isArray(val) ? val : [val]))
    .optional(),
  title: z.string().optional(),
  developer: z.string().optional(),
  publisher: z.string().optional(),
  minRating: z
    .string()
    .regex(/^\d+$/, "Rating must be a number")
    .transform(Number)
    .optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
});
