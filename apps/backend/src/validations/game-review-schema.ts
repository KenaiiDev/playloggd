import { z } from "zod";

export const createReviewSchema = z.object({
  gameExternalId: z.string().min(1, "Game ID is required"),
  rating: z
    .number()
    .min(0, "Rating must be at least 0")
    .max(5, "Rating must be at most 5"),
  content: z.string().min(1, "Review content is required"),
  hoursPlayed: z.number().min(0, "Hours played must be positive").optional(),
  playedAt: z.string().datetime().optional(),
});

export const updateReviewParamsSchema = z.object({
  reviewId: z.uuid("Review ID must be a valid UUID"),
});

export const updateReviewBodySchema = z.object({
  rating: z
    .number()
    .min(0, "Rating must be at least 0")
    .max(5, "Rating must be at most 5")
    .optional(),
  content: z.string().min(1, "Review content cannot be empty").optional(),
  hoursPlayed: z.number().min(0, "Hours played must be positive").optional(),
  playedAt: z.string().datetime().optional(),
});

export const deleteReviewParamsSchema = z.object({
  reviewId: z.uuid("Review ID must be a valid UUID"),
});

export const getGameReviewsParamsSchema = z.object({
  gameId: z.string().min(1, "Game ID is required"),
});

export const getUserReviewsParamsSchema = z.object({
  userId: z.uuid("User ID must be a valid UUID"),
});
