import { Router } from "express";
import {
  deleteMe,
  getMe,
  updateAvatar,
  updateMe
} from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { updateAvatarBodySchema, updateMeBodySchema } from "../schemas/user.schema";

const router = Router();

router.use(authenticate);

router.get("/me", getMe);
router.put("/me", validate({ body: updateMeBodySchema }), updateMe);
router.delete("/me", deleteMe);
router.post("/me/avatar", validate({ body: updateAvatarBodySchema }), updateAvatar);

export default router;