import { Request, Response } from 'express';
import { feedService } from '../services/feed.service';
import { addReactionSchema } from '../schemas/reaction.schema';

/**
 * @swagger
 * /api/posts/{id}/reactions:
 *   post:
 *     tags: [Reactions]
 *     summary: Adicionar reação
 */
export const addReaction = async (req: Request, res: Response): Promise<void> => {
  const result = addReactionSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ error: 'Dados inválidos', details: result.error.issues });
    return;
  }

  try {
    const reaction = await feedService.addReaction(
      Number(req.params.id),
      req.auth!.userId,
      result.data.type
    );
    res.status(201).json(reaction);
  } catch (err: unknown) {
    res.status(500).json({ error: (err as Error).message });
  }
};

/**
 * @swagger
 * /api/posts/{id}/reactions:
 *   delete:
 *     tags: [Reactions]
 *     summary: Remover reação
 */
export const removeReaction = async (req: Request, res: Response): Promise<void> => {
  try {
    await feedService.removeReaction(
      Number(req.params.id),
      req.auth!.userId
    );
    res.status(204).send();
  } catch (err: unknown) {
    res.status(500).json({ error: (err as Error).message });
  }
};
