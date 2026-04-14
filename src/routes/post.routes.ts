import { Router } from 'express';
import { createPost, getPost, deletePost } from '../controllers/post.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authMiddleware, createPost);
router.get('/:id', authMiddleware, getPost);
router.delete('/:id', authMiddleware, deletePost);

export default router;
