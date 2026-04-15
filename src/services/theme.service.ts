import { themeModel } from "../models/theme.model";
import type { CreateThemeBody } from "../schemas/run.schema";
import { AppError } from "../utils/http-error";

export const themeService = {
  async listAll() {
    return themeModel.findAll();
  },

  async getById(id: number) {
    const theme = await themeModel.findById(id);
    if (!theme) throw new AppError("Tema não encontrado.", 404, "THEME_NOT_FOUND");
    return theme;
  },

  async create(body: CreateThemeBody) {
    const existing = await themeModel.findByName(body.name);
    if (existing) throw new AppError("Já existe um tema com esse nome.", 409, "THEME_NAME_TAKEN");
    return themeModel.create(body);
  },

  async delete(id: number) {
    const theme = await themeModel.findById(id);
    if (!theme) throw new AppError("Tema não encontrado.", 404, "THEME_NOT_FOUND");
    await themeModel.delete(id);
  },
};
