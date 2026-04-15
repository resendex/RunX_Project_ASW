import { prisma } from "../config/prisma";
import type { CreateRunBody, UpdateRunBody } from "../schemas/run.schema";

export interface RunFilters {
  themeId?: number;
  from?: Date;
  to?: Date;
  search?: string;
  limit?: number;
  offset?: number;
}

const runInclude = {
  theme: true,
} as const;

export const runModel = {
  async findAllByUser(userId: number, filters: RunFilters = {}) {
    const { themeId, from, to, search, limit = 20, offset = 0 } = filters;

    return prisma.run.findMany({
      where: {
        userId,
        ...(themeId ? { themeId } : {}),
        ...(from || to
          ? {
              startedAt: {
                ...(from ? { gte: from } : {}),
                ...(to ? { lte: to } : {}),
              },
            }
          : {}),
        ...(search
          ? {
              observations: { contains: search, mode: "insensitive" },
            }
          : {}),
      },
      include: runInclude,
      orderBy: { startedAt: "desc" },
      take: limit,
      skip: offset,
    });
  },

  async findById(id: number) {
    return prisma.run.findUnique({
      where: { id },
      include: { theme: true, routeSuggestions: true },
    });
  },

  async findByWeek(userId: number, weekStart: Date, weekEnd: Date) {
    return prisma.run.findMany({
      where: {
        userId,
        startedAt: { gte: weekStart, lte: weekEnd },
      },
      include: runInclude,
      orderBy: { startedAt: "asc" },
    });
  },

  async findRecentByUser(userId: number, limit = 10) {
    return prisma.run.findMany({
      where: { userId },
      orderBy: { startedAt: "desc" },
      take: limit,
      include: runInclude,
    });
  },

  async create(userId: number, data: CreateRunBody) {
    return prisma.run.create({
      data: {
        userId,
        startedAt: new Date(data.startedAt),
        endedAt: new Date(data.endedAt),
        distanceKm: data.distanceKm,
        durationSec: data.durationSec,
        avgPace: data.avgPace ?? null,
        calories: data.calories ?? null,
        routeGeojson: data.routeGeojson ?? undefined,
        photoUrl: data.photoUrl ?? null,
        observations: data.observations ?? null,
        motivationalPhrase: data.motivationalPhrase ?? null,
        themeId: data.themeId ?? null,
        weatherData: data.weatherData ?? undefined,
      },
      include: runInclude,
    });
  },

  async update(id: number, data: UpdateRunBody) {
    return prisma.run.update({
      where: { id },
      data: {
        ...(data.observations !== undefined ? { observations: data.observations } : {}),
        ...(data.motivationalPhrase !== undefined
          ? { motivationalPhrase: data.motivationalPhrase }
          : {}),
        ...(data.photoUrl !== undefined ? { photoUrl: data.photoUrl } : {}),
        ...(data.themeId !== undefined ? { themeId: data.themeId } : {}),
      },
      include: runInclude,
    });
  },

  async delete(id: number) {
    return prisma.run.delete({ where: { id } });
  },

  async sumDistanceByWeek(userId: number, weekStart: Date, weekEnd: Date): Promise<number> {
    const result = await prisma.run.aggregate({
      where: {
        userId,
        startedAt: { gte: weekStart, lte: weekEnd },
      },
      _sum: { distanceKm: true },
    });
    return result._sum.distanceKm ?? 0;
  },
};
