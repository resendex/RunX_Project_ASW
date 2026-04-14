import { Router } from 'express';
import { addComment, deleteComment } from '../controllers/comment.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/:id/comments', authMiddleware, addComment);
router.delete('/comments/:id', authMiddleware, deleteComment);

export default router;
