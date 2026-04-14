import { z } from 'zod';
/**
 * Schema para adicionar reação.
 * Usa o enum ReactionType do Prisma: LIKE | LOVE | CLAP | FIRE
 */
export const addReactionSchema = z.object({
  type: z
    .enum(['LIKE', 'LOVE', 'CLAP', 'FIRE'], {
      errorMap: () => ({
        message: 'Tipo de reação inválido. Valores permitidos: LIKE, LOVE, CLAP, FIRE',
      }),
    })
    .default('LIKE'),
});

export type AddReactionInput = z.infer<typeof addReactionSchema>;
