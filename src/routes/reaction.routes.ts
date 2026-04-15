import { Router } from 'express';
import { addReaction, removeReaction } from '../controllers/reaction.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { idParamSchema } from '../schemas/common.schema';
import { addReactionSchema } from '../schemas/reaction.schema';

const router = Router();

router.post(
	'/:id/reactions',
	authenticate,
	validate({ params: idParamSchema, body: addReactionSchema }),
	addReaction
);
router.delete('/:id/reactions', authenticate, validate({ params: idParamSchema }), removeReaction);

export default router;
