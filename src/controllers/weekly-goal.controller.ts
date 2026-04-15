import type { Request, Response, NextFunction } from "express";
import { weeklyGoalService } from "../services/weekly-goal.service";
import { upsertWeeklyGoalSchema } from "../schemas/run.schema";

export const weeklyGoalController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const goals = await weeklyGoalService.listByUser(req.auth!.userId);
      res.json({ goals });
    } catch (err) {
      next(err);
    }
  },

  async getCurrent(req: Request, res: Response, next: NextFunction) {
    try {
      const progress = await weeklyGoalService.getCurrentWeek(req.auth!.userId);
      res.json({ weeklyGoal: progress });
    } catch (err) {
      next(err);
    }
  },

  async upsert(req: Request, res: Response, next: NextFunction) {
    try {
      const result = upsertWeeklyGoalSchema.safeParse(req.body);
      if (!result.success) {
        res.status(400).json({
          error: {
            message: "Dados inválidos.",
            details: result.error.flatten().fieldErrors,
          },
        });
        return;
      }
      const goal = await weeklyGoalService.upsert(req.auth!.userId, result.data);
      res.status(200).json({ goal });
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await weeklyGoalService.delete(Number(req.params.id), req.auth!.userId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
