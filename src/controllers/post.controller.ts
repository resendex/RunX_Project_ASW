import { Request, Response } from 'express';
import { feedService } from '../services/feed.service';
import { createPostSchema } from '../schemas';

/**
 * @swagger
 * /api/posts:
 *   post:
 *     tags: [Posts]
 *     summary: Criar nova publicação
 */
export const createPost = async (req: Request, res: Response): Promise<void> => {
  const result = createPostSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ error: 'Dados inválidos', details: result.error.errors });
    return;
  }

  try {
    const post = await feedService.createPost(req.user!.userId, result.data);
    res.status(201).json(post);
  } catch (err: unknown) {
    res.status(500).json({ error: (err as Error).message });
  }
};

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     tags: [Posts]
 *     summary: Obter publicação
 */
export const getPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const post = await feedService.getPostById(Number(req.params.id));
    res.json(post);
  } catch (err: unknown) {
    res.status(404).json({ error: (err as Error).message });
  }
};

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     tags: [Posts]
 *     summary: Eliminar publicação
 */
export const deletePost = async (req: Request, res: Response): Promise<void> => {
  try {
    await feedService.deletePost(Number(req.params.id), req.user!.userId);
    res.status(204).send();
  } catch (err: unknown) {
    const status = (err as Error).message.includes('permissão') ? 403 : 404;
    res.status(status).json({ error: (err as Error).message });
  }
};