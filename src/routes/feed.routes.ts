import { Router } from 'express';
import { getFeed } from '../controllers/feed.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, getFeed);

export default router;
