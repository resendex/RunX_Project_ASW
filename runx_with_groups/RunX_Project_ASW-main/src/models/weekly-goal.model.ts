import { prisma } from "../config/prisma";

export const weeklyGoalModel = {
  async findByUserAndWeek(userId: number, weekStart: Date) {
    return prisma.weeklyGoal.findUnique({
      where: { userId_weekStart: { userId, weekStart } },
    });
  },

  async findAllByUser(userId: number) {
    return prisma.weeklyGoal.findMany({
      where: { userId },
      orderBy: { weekStart: "desc" },
    });
  },

  async upsert(userId: number, weekStart: Date, targetKm: number) {
    return prisma.weeklyGoal.upsert({
      where: { userId_weekStart: { userId, weekStart } },
      update: { targetKm },
      create: { userId, weekStart, targetKm, achievedKm: 0 },
    });
  },

  async updateAchieved(userId: number, weekStart: Date, achievedKm: number) {
    return prisma.weeklyGoal.updateMany({
      where: { userId, weekStart },
      data: { achievedKm },
    });
  },

  async delete(id: number, userId: number) {
    return prisma.weeklyGoal.deleteMany({ where: { id, userId } });
  },
};
