import { Router } from 'express';
import { getNotifications } from '../controllers/notification.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { paginationQuerySchema } from '../schemas/common.schema';

const router = Router();
router.get('/', authenticate, validate({ query: paginationQuerySchema }), getNotifications);
export default router;
