import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({ ok: true, service: "runx-fase2-api" });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);

export default router;
