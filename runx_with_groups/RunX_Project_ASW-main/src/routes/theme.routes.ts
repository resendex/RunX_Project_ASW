import { Router } from "express";
import { themeController } from "../controllers/theme.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// GET /themes — público (qualquer utilizador pode ver os temas disponíveis)
router.get("/", themeController.list);

// GET /themes/:id
router.get("/:id", themeController.getById);

// POST /themes — autenticado (qualquer utilizador pode criar temas)
router.post("/", authenticate, themeController.create);

// DELETE /themes/:id — autenticado
router.delete("/:id", authenticate, themeController.delete);

export default router;
