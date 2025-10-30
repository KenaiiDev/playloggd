import { z } from "zod";

export const registerUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  email: z.email("Must be a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  bio: z.string().optional(),
});

export const getUserByIdSchema = z.object({
  id: z.uuid("ID must be a valid UUID"),
});

export const getUserByEmailSchema = z.object({
  email: z.email("Must be a valid email address"),
});

export const updateUserIdSchema = z.object({
  id: z.uuid("ID must be a valid UUID"),
});

export const updateUserSchema = z.object({
  username: z.string().min(3).optional(),
  email: z.email().optional(),
  bio: z.string().optional(),
  avatarUrl: z.url().optional(),
});

export const deleteUserSchema = z.object({
  id: z.uuid("ID must be a valid UUID"),
});
