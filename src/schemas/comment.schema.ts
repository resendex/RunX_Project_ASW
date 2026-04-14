import { z } from 'zod';

/**
 * Schema para adicionar comentário
 */
export const addCommentSchema = z.object({
  content: z
    .string()
    .min(1, 'Comentário não pode estar vazio')
    .max(1000, 'Comentário não pode ter mais de 1000 caracteres')
    .trim(),
});

export type AddCommentInput = z.infer<typeof addCommentSchema>;