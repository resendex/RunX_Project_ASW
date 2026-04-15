import { Router } from 'express';
import { addReaction, removeReaction } from '../controllers/reaction.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/:id/reactions', authenticate, addReaction);
router.delete('/:id/reactions', authenticate, removeReaction);

export default router;
