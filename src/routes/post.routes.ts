import { Router } from 'express';
import { createPost, getPost, deletePost } from '../controllers/post.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { idParamSchema } from '../schemas/common.schema';
import { createPostSchema } from '../schemas/post.schema';

const router = Router();

router.post('/', authenticate, validate({ body: createPostSchema }), createPost);
router.get('/:id', authenticate, validate({ params: idParamSchema }), getPost);
router.delete('/:id', authenticate, validate({ params: idParamSchema }), deletePost);

export default router;
