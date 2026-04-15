import { z } from 'zod';

const postVisibilitySchema = z.enum(['PUBLIC', 'GROUP', 'PRIVATE']);

/**
 * Schema para criação de publicação
 */
export const createPostSchema = z.object({
  content: z
    .string()
    .trim()
    .max(2000, 'Publicação não pode ter mais de 2000 caracteres')
    .optional(),

  runId: z
    .number()
    .int('ID da corrida deve ser um inteiro')
    .positive('ID da corrida deve ser positivo')
    .optional(),

  groupEventId: z
    .number()
    .int('ID do evento deve ser um inteiro')
    .positive('ID do evento deve ser positivo')
    .optional(),

  visibility: z
    .enum(['PUBLIC', 'GROUP', 'PRIVATE'])
    .default('PUBLIC'),

  isAnonymous: z
    .boolean()
    .default(false),
}).refine(
  (data) => Boolean(data.content || data.runId || data.groupEventId),
  {
    message: 'A publicação deve ter conteúdo, corrida ou evento associado',
  }
);

/**
 * Schema para atualização de publicação
 */
export const updatePostSchema = z.object({
  content: z
    .string()
    .trim()
    .max(2000, 'Publicação não pode ter mais de 2000 caracteres')
    .optional(),

  visibility: postVisibilitySchema.optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;