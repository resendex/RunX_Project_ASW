import { Router } from 'express';
import { getFeed } from '../controllers/feed.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { paginationQuerySchema } from '../schemas/common.schema';

const router = Router();

router.get('/', authenticate, validate({ query: paginationQuerySchema }), getFeed);

export default router;
