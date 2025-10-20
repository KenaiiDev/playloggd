import { z } from "zod";

// Schema para registrar un usuario
export const registerUserSchema = z.object({
  username: z
    .string()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
  email: z.email("Debe ser un correo electrónico válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  bio: z.string().optional(),
});

export const getUserByIdSchema = z.object({
  id: z.string().uuid("El ID debe ser un UUID válido"),
});

export const getUserByEmailSchema = z.object({
  email: z.email("Debe ser un correo electrónico válido"),
});

export const updateUserSchema = z.object({
  username: z.string().min(3).optional(),
  email: z.email().optional(),
  bio: z.string().optional(),
});

export const deleteUserSchema = z.object({
  id: z.uuid("El ID debe ser un UUID válido"),
});
