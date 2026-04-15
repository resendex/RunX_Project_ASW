import { Router } from 'express';
import { createPost, getPost, deletePost } from '../controllers/post.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authenticate, createPost);
router.get('/:id', authenticate, getPost);
router.delete('/:id', authenticate, deletePost);

export default router;
