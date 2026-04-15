import { Router } from 'express';
import { addComment, deleteComment } from '../controllers/comment.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { idParamSchema } from '../schemas/common.schema';
import { addCommentSchema } from '../schemas/comment.schema';

const router = Router();

router.post(
	'/:id/comments',
	authenticate,
	validate({ params: idParamSchema, body: addCommentSchema }),
	addComment
);
router.delete('/comments/:id', authenticate, validate({ params: idParamSchema }), deleteComment);

export default router;
