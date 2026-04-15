import { Router } from "express";
import { themeController } from "../controllers/theme.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createThemeSchema, runIdParamSchema } from "../schemas/run.schema";

const router = Router();

// GET /themes — público (qualquer utilizador pode ver os temas disponíveis)
router.get("/", themeController.list);

// GET /themes/:id
router.get("/:id", validate({ params: runIdParamSchema }), themeController.getById);

// POST /themes — autenticado (qualquer utilizador pode criar temas)
router.post("/", authenticate, validate({ body: createThemeSchema }), themeController.create);

// DELETE /themes/:id — autenticado
router.delete("/:id", authenticate, validate({ params: runIdParamSchema }), themeController.delete);

export default router;
