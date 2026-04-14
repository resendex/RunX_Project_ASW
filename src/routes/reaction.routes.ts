import { Router } from 'express';
import { addReaction, removeReaction } from '../controllers/reaction.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/:id/reactions', authMiddleware, addReaction);
router.delete('/:id/reactions', authMiddleware, removeReaction);

export default router;