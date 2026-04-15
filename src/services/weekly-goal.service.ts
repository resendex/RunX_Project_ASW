import { weeklyGoalModel } from "../models/weekly-goal.model";
import { runModel } from "../models/run.model";
import type { UpsertWeeklyGoalBody } from "../schemas/run.schema";
import { AppError } from "../utils/http-error";
import { getWeekBounds } from "../utils/week";

export const weeklyGoalService = {
  async listByUser(userId: number) {
    return weeklyGoalModel.findAllByUser(userId);
  },

  async getCurrentWeek(userId: number) {
    const { weekStart, weekEnd } = getWeekBounds(new Date());
    const goal = await weeklyGoalModel.findByUserAndWeek(userId, weekStart);
    const achievedKm = await runModel.sumDistanceByWeek(userId, weekStart, weekEnd);

    return {
      weekStart,
      weekEnd,
      targetKm: goal?.targetKm ?? null,
      achievedKm,
      progressPercent: goal ? Math.min(100, Math.round((achievedKm / goal.targetKm) * 100)) : null,
    };
  },

  async upsert(userId: number, body: UpsertWeeklyGoalBody) {
    const weekStart = new Date(body.weekStart);
    return weeklyGoalModel.upsert(userId, weekStart, body.targetKm);
  },

  async delete(goalId: number, userId: number) {
    const deleted = await weeklyGoalModel.delete(goalId, userId);
    if (deleted.count === 0) {
      throw new AppError("Meta não encontrada.", 404, "GOAL_NOT_FOUND");
    }
  },
};
