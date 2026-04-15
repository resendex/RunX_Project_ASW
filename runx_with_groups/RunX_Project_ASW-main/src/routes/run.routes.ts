import { Router } from "express";
import { runController } from "../controllers/run.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// Todas as rotas de corridas requerem autenticação
router.use(authenticate);

// GET  /runs          — listar corridas do utilizador (com filtros)
router.get("/", runController.list);

// GET  /runs/week     — progresso semanal (DEVE vir antes de /:id)
router.get("/week", runController.getWeekProgress);

// POST /runs          — criar nova corrida
router.post("/", runController.create);

// GET  /runs/:id      — detalhe de uma corrida
router.get("/:id", runController.getById);

// PUT  /runs/:id      — editar corrida
router.put("/:id", runController.update);

// DELETE /runs/:id    — eliminar corrida
router.delete("/:id", runController.delete);

// GET  /runs/:id/suggest-route — sugestão de variante (stub para Fase 3)
router.get("/:id/suggest-route", runController.suggestRoute);

export default router;
