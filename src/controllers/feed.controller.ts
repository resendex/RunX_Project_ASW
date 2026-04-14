import { Request, Response } from 'express';
import { feedService } from '../services/feed.service';

/**
 * @swagger
 * /api/feed:
 *   get:
 *     tags: [Feed]
 *     summary: Obter feed social personalizado do utilizador autenticado
 */
export const getFeed = async (req: Request, res: Response): Promise<void> => {
  const page = Number(req.query.page) || 1;
  const limit = Math.min(Number(req.query.limit) || 10, 50);

  try {
    const result = await feedService.getFeed(req.user!.userId, page, limit);
    res.json(result);
  } catch (err: unknown) {
    res.status(500).json({ error: (err as Error).message });
  }
};