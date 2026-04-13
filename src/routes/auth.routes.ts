import { Router } from "express";
import {
  login,
  logout,
  refresh,
  register
} from "../controllers/auth.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  loginBodySchema,
  logoutBodySchema,
  refreshTokenBodySchema,
  registerBodySchema
} from "../schemas/auth.schema";

const router = Router();

router.post("/register", validate({ body: registerBodySchema }), register);
router.post("/login", validate({ body: loginBodySchema }), login);
router.post("/refresh", validate({ body: refreshTokenBodySchema }), refresh);
router.post("/logout", validate({ body: logoutBodySchema }), logout);

export default router;