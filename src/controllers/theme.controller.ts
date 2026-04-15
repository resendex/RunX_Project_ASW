import type { Request, Response, NextFunction } from "express";
import { themeService } from "../services/theme.service";
import { createThemeSchema } from "../schemas/run.schema";

export const themeController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const themes = await themeService.listAll();
      res.json({ themes });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const theme = await themeService.getById(Number(req.params.id));
      res.json({ theme });
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = createThemeSchema.safeParse(req.body);
      if (!result.success) {
        res.status(400).json({
          error: {
            message: "Dados inválidos.",
            details: result.error.flatten().fieldErrors,
          },
        });
        return;
      }
      const theme = await themeService.create(result.data);
      res.status(201).json({ theme });
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await themeService.delete(Number(req.params.id));
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
