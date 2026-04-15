import { prisma } from "../config/prisma";
import type { CreateThemeBody } from "../schemas/run.schema";

export const themeModel = {
  async findAll() {
    return prisma.theme.findMany({
      orderBy: { name: "asc" },
    });
  },

  async findById(id: number) {
    return prisma.theme.findUnique({ where: { id } });
  },

  async findByName(name: string) {
    return prisma.theme.findUnique({ where: { name } });
  },

  async create(data: CreateThemeBody) {
    return prisma.theme.create({ data });
  },

  async delete(id: number) {
    return prisma.theme.delete({ where: { id } });
  },
};
