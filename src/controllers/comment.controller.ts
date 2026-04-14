import { Request, Response } from 'express';
import { feedService } from '../services/feed.service';
import { addCommentSchema } from '../schemas';

/**
 * @swagger
 * /api/posts/{id}/comments:
 *   post:
 *     tags: [Comments]
 *     summary: Adicionar comentário
 */
export const addComment = async (req: Request, res: Response): Promise<void> => {
  const result = addCommentSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ error: 'Dados inválidos', details: result.error.errors });
    return;
  }

  try {
    const comment = await feedService.addComment(
      Number(req.params.id),
      req.user!.userId,
      result.data.content
    );
    res.status(201).json(comment);
  } catch (err: unknown) {
    res.status(500).json({ error: (err as Error).message });
  }
};

/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     tags: [Comments]
 *     summary: Eliminar comentário
 */
export const deleteComment = async (req: Request, res: Response): Promise<void> => {
  try {
    await feedService.deleteComment(Number(req.params.id), req.user!.userId);
    res.status(204).send();
  } catch (err: unknown) {
    const status = (err as Error).message.includes('permissão') ? 403 : 404;
    res.status(status).json({ error: (err as Error).message });
  }
};