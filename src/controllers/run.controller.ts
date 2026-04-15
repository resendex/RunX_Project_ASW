import type { Request, Response, NextFunction } from "express";
import { runService } from "../services/run.service";
import {
  createRunSchema,
  updateRunSchema,
  listRunsQuerySchema,
  runIdParamSchema,
} from "../schemas/run.schema";

export const runController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = listRunsQuerySchema.safeParse(req.query);
      if (!result.success) {
        res.status(400).json({
          error: {
            message: "Parâmetros de query inválidos.",
            details: result.error.flatten().fieldErrors,
          },
        });
        return;
      }
      const runs = await runService.list(req.auth!.userId, result.data);
      res.json({ runs });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const param = runIdParamSchema.safeParse(req.params);
      if (!param.success) {
        res.status(400).json({ error: { message: "ID inválido." } });
        return;
      }
      const run = await runService.getById(param.data.id, req.auth!.userId);
      res.json({ run });
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = createRunSchema.safeParse(req.body);
      if (!result.success) {
        res.status(400).json({
          error: {
            message: "Dados inválidos.",
            details: result.error.flatten().fieldErrors,
          },
        });
        return;
      }
      const run = await runService.create(req.auth!.userId, result.data);
      res.status(201).json({ run });
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const param = runIdParamSchema.safeParse(req.params);
      if (!param.success) {
        res.status(400).json({ error: { message: "ID inválido." } });
        return;
      }
      const result = updateRunSchema.safeParse(req.body);
      if (!result.success) {
        res.status(400).json({
          error: {
            message: "Dados inválidos.",
            details: result.error.flatten().fieldErrors,
          },
        });
        return;
      }
      const run = await runService.update(param.data.id, req.auth!.userId, result.data);
      res.json({ run });
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const param = runIdParamSchema.safeParse(req.params);
      if (!param.success) {
        res.status(400).json({ error: { message: "ID inválido." } });
        return;
      }
      await runService.delete(param.data.id, req.auth!.userId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

  async getWeekProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const progress = await runService.getWeekProgress(req.auth!.userId);
      res.json(progress);
    } catch (err) {
      next(err);
    }
  },

  async suggestRoute(req: Request, res: Response, next: NextFunction) {
    try {
      const param = runIdParamSchema.safeParse(req.params);
      if (!param.success) {
        res.status(400).json({ error: { message: "ID inválido." } });
        return;
      }
      const suggestion = await runService.suggestRoute(param.data.id, req.auth!.userId);
      res.json(suggestion);
    } catch (err) {
      next(err);
    }
  },
};
