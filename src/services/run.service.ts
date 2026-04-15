import { runModel } from "../models/run.model";
import { weeklyGoalModel } from "../models/weekly-goal.model";
import { themeModel } from "../models/theme.model";
import { fetchWeatherForRun } from "../integrations/openweather";
import type { CreateRunBody, UpdateRunBody, ListRunsQuery } from "../schemas/run.schema";
import { AppError } from "../utils/http-error";
import { getWeekBounds } from "../utils/week";

export const runService = {
  async list(userId: number, query: ListRunsQuery) {
    return runModel.findAllByUser(userId, {
      themeId: query.themeId,
      from: query.from ? new Date(query.from) : undefined,
      to: query.to ? new Date(query.to) : undefined,
      search: query.search,
      limit: query.limit ?? 20,
      offset: query.offset ?? 0,
    });
  },

  async getById(id: number, userId: number) {
    const run = await runModel.findById(id);
    if (!run) throw new AppError("Corrida não encontrada.", 404, "RUN_NOT_FOUND");
    if (run.userId !== userId) throw new AppError("Acesso negado.", 403, "FORBIDDEN");
    return run;
  },

  async create(userId: number, body: CreateRunBody) {
    // Validar datas
    const started = new Date(body.startedAt);
    const ended = new Date(body.endedAt);
    if (ended <= started) {
      throw new AppError("endedAt deve ser posterior a startedAt.", 422, "INVALID_DATES");
    }

    // Validar tema se fornecido
    if (body.themeId) {
      const theme = await themeModel.findById(body.themeId);
      if (!theme) throw new AppError("Tema não encontrado.", 404, "THEME_NOT_FOUND");
    }

    // Calcular avgPace automaticamente se não fornecido (min/km)
    let avgPace = body.avgPace;
    if (!avgPace && body.distanceKm > 0) {
      avgPace = body.durationSec / 60 / body.distanceKm;
    }

    // Tentar obter dados meteorológicos (degradação graciosa)
    let weatherData = body.weatherData ?? null;
    if (!weatherData && body.routeGeojson) {
      // Tentar extrair coordenadas do primeiro ponto do GeoJSON
      try {
        const geojson = body.routeGeojson as Record<string, unknown>;
        const coords = (geojson?.features as unknown[])?.[0] as Record<string, unknown>;
        const geometry = coords?.geometry as Record<string, unknown>;
        const coordinates = geometry?.coordinates as number[][];
        if (coordinates?.[0]) {
          const [lon, lat] = coordinates[0];
          const weather = await fetchWeatherForRun(lat, lon);
          if (weather) weatherData = weather as unknown as Record<string, unknown>;
        }
      } catch {
        // silently ignore — weather is optional
      }
    }

    const run = await runModel.create(userId, {
      ...body,
      avgPace,
      weatherData,
    });

    // Atualizar progresso semanal
    await runService._refreshWeeklyGoal(userId, started);

    return run;
  },

  async update(id: number, userId: number, body: UpdateRunBody) {
    const run = await runModel.findById(id);
    if (!run) throw new AppError("Corrida não encontrada.", 404, "RUN_NOT_FOUND");
    if (run.userId !== userId) throw new AppError("Acesso negado.", 403, "FORBIDDEN");

    if (body.themeId) {
      const theme = await themeModel.findById(body.themeId);
      if (!theme) throw new AppError("Tema não encontrado.", 404, "THEME_NOT_FOUND");
    }

    return runModel.update(id, body);
  },

  async delete(id: number, userId: number) {
    const run = await runModel.findById(id);
    if (!run) throw new AppError("Corrida não encontrada.", 404, "RUN_NOT_FOUND");
    if (run.userId !== userId) throw new AppError("Acesso negado.", 403, "FORBIDDEN");

    await runModel.delete(id);

    // Recalcular progresso semanal após apagar
    await runService._refreshWeeklyGoal(userId, run.startedAt);
  },

  async getWeekProgress(userId: number) {
    const { weekStart, weekEnd } = getWeekBounds(new Date());
    const runs = await runModel.findByWeek(userId, weekStart, weekEnd);
    const achievedKm = runs.reduce((sum, r) => sum + r.distanceKm, 0);
    const goal = await weeklyGoalModel.findByUserAndWeek(userId, weekStart);

    const days = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(weekStart);
      day.setUTCDate(weekStart.getUTCDate() + i);
      const dayRuns = runs.filter((r) => {
        const d = new Date(r.startedAt);
        return (
          d.getUTCFullYear() === day.getUTCFullYear() &&
          d.getUTCMonth() === day.getUTCMonth() &&
          d.getUTCDate() === day.getUTCDate()
        );
      });
      return {
        date: day.toISOString().split("T")[0],
        runs: dayRuns.length,
        distanceKm: dayRuns.reduce((s, r) => s + r.distanceKm, 0),
      };
    });

    return {
      weekStart: weekStart.toISOString(),
      weekEnd: weekEnd.toISOString(),
      targetKm: goal?.targetKm ?? null,
      achievedKm: Math.round(achievedKm * 100) / 100,
      progressPercent: goal
        ? Math.min(100, Math.round((achievedKm / goal.targetKm) * 100))
        : null,
      days,
    };
  },

  async suggestRoute(runId: number, userId: number) {
    const run = await runModel.findById(runId);
    if (!run) throw new AppError("Corrida não encontrada.", 404, "RUN_NOT_FOUND");
    if (run.userId !== userId) throw new AppError("Acesso negado.", 403, "FORBIDDEN");

    // Estrutura pronta — integração LLM será adicionada na Fase 3
    return {
      runId,
      status: "pending_llm_integration",
      message:
        "A sugestão de trajeto via LLM será implementada na Fase 3. Estrutura de endpoint operacional.",
      currentRoute: run.routeGeojson ?? null,
    };
  },

  // ─── Internal helpers ──────────────────────────────────────────────────────

  async _refreshWeeklyGoal(userId: number, runDate: Date) {
    try {
      const { weekStart, weekEnd } = getWeekBounds(runDate);
      const achieved = await runModel.sumDistanceByWeek(userId, weekStart, weekEnd);
      await weeklyGoalModel.updateAchieved(userId, weekStart, achieved);
    } catch {
      // Não bloquear o fluxo principal se a atualização da meta falhar
    }
  },
};
