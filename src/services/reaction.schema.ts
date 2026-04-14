import { z } from 'zod';

/**
 * Schema para adicionar/remover reação
 */
export const addReactionSchema = z.object({
  emoji: z
    .string()
    .min(1, 'Emoji é obrigatório')
    .max(10, 'Emoji inválido'),
});

export type AddReactionInput = z.infer<typeof addReactionSchema>;