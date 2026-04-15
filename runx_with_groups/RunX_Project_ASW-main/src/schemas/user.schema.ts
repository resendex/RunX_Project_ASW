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

export const updateMeBodySchema = z
  .object({
    username: usernameSchema.optional(),
    email: emailSchema.optional(),
    bio: z.string().trim().max(280).nullable().optional(),
    location: z.string().trim().max(120).nullable().optional()
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Deve enviar pelo menos um campo para atualizar."
  });

export const updateAvatarBodySchema = z.object({
  avatarUrl: z.string().trim().url("avatarUrl deve ser uma URL valida")
});

export type UpdateMeBody = z.infer<typeof updateMeBodySchema>;
export type UpdateAvatarBody = z.infer<typeof updateAvatarBodySchema>;