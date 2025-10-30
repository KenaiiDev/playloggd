import { z } from "zod";

// Schema para registrar un usuario
export const registerUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  email: z.email("Must be a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
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
