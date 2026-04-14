import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import feedRoutes from './feed.routes';
import postRoutes from './post.routes';
import reactionRoutes from './reaction.routes';
import commentRoutes from './comment.routes';

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({ ok: true, service: "runx-fase2-api" });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use('/feed', feedRoutes);
router.use('/posts', postRoutes);
router.use('/reactions', reactionRoutes);
router.use('/comments', commentRoutes);

export default router;
