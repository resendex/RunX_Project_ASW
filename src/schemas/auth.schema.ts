import { z } from "zod";

const usernameSchema = z
  .string()
  .trim()
  .min(3, "username deve ter no minimo 3 caracteres")
  .max(30, "username nao pode exceder 30 caracteres")
  .regex(/^[a-zA-Z0-9_.-]+$/, "username contem caracteres invalidos");

const emailSchema = z
  .string()
  .trim()
  .email("email invalido")
  .max(255)
  .transform((value) => value.toLowerCase());

const passwordSchema = z
  .string()
  .min(8, "password deve ter pelo menos 8 caracteres")
  .max(72, "password nao pode exceder 72 caracteres")
  .regex(/[A-Za-z]/, "password deve conter letras")
  .regex(/[0-9]/, "password deve conter numeros");

export const registerBodySchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema
});

export const loginBodySchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "password e obrigatoria")
});

export const refreshTokenBodySchema = z.object({
  refreshToken: z.string().trim().min(20, "refreshToken invalido")
});

export const logoutBodySchema = refreshTokenBodySchema;

export type RegisterBody = z.infer<typeof registerBodySchema>;
export type LoginBody = z.infer<typeof loginBodySchema>;
export type RefreshTokenBody = z.infer<typeof refreshTokenBodySchema>;
export type LogoutBody = z.infer<typeof logoutBodySchema>;