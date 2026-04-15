import { Request, Response } from 'express';
import * as notificationService from '../services/notification.service';

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     tags: [Notifications]
 *     summary: Listar notificações do utilizador autenticado
 */
export const getNotifications = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Math.min(Number(req.query.limit) || 10, 50);

  try {
    const result = await notificationService.getNotifications(
      req.auth!.userId,
      page,
      limit
    );
    res.json(result);
  } catch (err: unknown) {
    res.status(500).json({ error: (err as Error).message });
  }
};
