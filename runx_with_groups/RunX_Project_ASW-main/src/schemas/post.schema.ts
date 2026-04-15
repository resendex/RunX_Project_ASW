import { z } from 'zod';

/**
 * Schema para criação de publicação
 */
export const createPostSchema = z.object({
  content: z
    .string()
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
    .enum(['PUBLIC', 'GROUP', 'PRIVATE'], {
      errorMap: () => ({
        message: 'Visibilidade inválida. Valores permitidos: PUBLIC, GROUP, PRIVATE',
      }),
    })
    .default('PUBLIC'),

  isAnonymous: z
    .boolean({ invalid_type_error: 'isAnonymous deve ser booleano' })
    .default(false),
}).refine(
  (data) => data.content || data.runId || data.groupEventId,
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
    .max(2000, 'Publicação não pode ter mais de 2000 caracteres')
    .optional(),

  visibility: z
    .enum(['PUBLIC', 'GROUP', 'PRIVATE'])
    .optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;