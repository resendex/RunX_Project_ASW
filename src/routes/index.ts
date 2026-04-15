import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import feedRoutes from './feed.routes';
import postRoutes from './post.routes';
import reactionRoutes from './reaction.routes';
import commentRoutes from './comment.routes';
import notificationRoutes from './notification.routes';
import runRoutes        from "./run.routes";
import themeRoutes      from "./theme.routes";
import weeklyGoalRoutes from "./weekly-goal.routes";
import groupRoutes      from "./group.routes";

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({ ok: true, service: "runx-fase2-api" });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use('/feed', feedRoutes);
router.use('/posts', postRoutes);
router.use('/posts', reactionRoutes);
router.use('/posts', commentRoutes);
router.use('/notifications', notificationRoutes);
router.use("/runs",         runRoutes);
router.use("/themes",       themeRoutes);
router.use("/weekly-goals", weeklyGoalRoutes);
router.use("/groups",       groupRoutes);

export default router;
