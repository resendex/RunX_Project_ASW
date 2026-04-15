import { Router } from "express";
import { weeklyGoalController } from "../controllers/weekly-goal.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// Todas as rotas de metas requerem autenticação
router.use(authenticate);

// GET /weekly-goals — listar todas as metas do utilizador
router.get("/", weeklyGoalController.list);

// GET /weekly-goals/current — meta e progresso da semana atual
router.get("/current", weeklyGoalController.getCurrent);

// PUT /weekly-goals — criar ou atualizar meta (upsert)
router.put("/", weeklyGoalController.upsert);

// DELETE /weekly-goals/:id — eliminar meta
router.delete("/:id", weeklyGoalController.delete);

export default router;
