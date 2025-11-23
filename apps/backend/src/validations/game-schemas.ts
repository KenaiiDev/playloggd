import { z } from "zod";

const paginationSchema = z.object({
  limit: z
    .string()
    .regex(/^\d+$/, "Limit must be a number")
    .transform(Number)
    .refine((n) => n > 0 && n <= 100, "Limit must be between 1 and 100")
    .optional(),
  offset: z
    .string()
    .regex(/^\d+$/, "Offset must be a number")
    .transform(Number)
    .refine((n) => n >= 0, "Offset must be greater than or equal to 0")
    .optional(),
});

export const getGameByIdSchema = z.object({
  gameId: z.string().min(1, "Game ID is required"),
});

export const searchGamesSchema = z
  .object({
    q: z.string().min(2, "Search query must be at least 2 characters long"),
  })
  .merge(paginationSchema);

export const getMostPopularGamesSchema = paginationSchema;
export const getTopRatedGamesSchema = paginationSchema;
export const getUpcomingGamesSchema = paginationSchema;
export const getRecentReleaseGamesSchema = paginationSchema;

export const getGamesByFilterSchema = z
  .object({
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
  })
  .merge(paginationSchema);
