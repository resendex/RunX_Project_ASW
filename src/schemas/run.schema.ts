import { z } from "zod";

// ─── Theme ───────────────────────────────────────────────────────────────────

export const createThemeSchema = z.object({
  name: z.string().min(1, "Nome obrigatório").max(50, "Nome demasiado longo"),
  emoji: z.string().max(10).optional().nullable(),
  colorHex: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Formato inválido (ex: #FF5733)")
    .optional()
    .nullable(),
});

export type CreateThemeBody = z.infer<typeof createThemeSchema>;

// ─── WeeklyGoal ──────────────────────────────────────────────────────────────

export const upsertWeeklyGoalSchema = z.object({
  weekStart: z.string().datetime({ message: "Data inválida. Usa formato ISO 8601." }),
  targetKm: z
    .number({ invalid_type_error: "targetKm deve ser número" })
    .positive("targetKm deve ser positivo")
    .max(500, "targetKm demasiado elevado"),
});

export type UpsertWeeklyGoalBody = z.infer<typeof upsertWeeklyGoalSchema>;

// ─── Run ─────────────────────────────────────────────────────────────────────

export const createRunSchema = z.object({
  startedAt: z.string().datetime({ message: "startedAt inválido. Usa ISO 8601." }),
  endedAt: z.string().datetime({ message: "endedAt inválido. Usa ISO 8601." }),
  distanceKm: z
    .number({ invalid_type_error: "distanceKm deve ser número" })
    .positive("distanceKm deve ser positivo")
    .max(300, "distanceKm demasiado elevado"),
  durationSec: z
    .number({ invalid_type_error: "durationSec deve ser inteiro" })
    .int()
    .positive("durationSec deve ser positivo"),
  avgPace: z
    .number({ invalid_type_error: "avgPace deve ser número" })
    .positive()
    .optional()
    .nullable(),
  calories: z
    .number({ invalid_type_error: "calories deve ser inteiro" })
    .int()
    .nonnegative()
    .optional()
    .nullable(),
  routeGeojson: z.record(z.unknown()).optional().nullable(),
  photoUrl: z.string().url("photoUrl inválido").optional().nullable(),
  observations: z.string().max(1000).optional().nullable(),
  motivationalPhrase: z.string().max(300).optional().nullable(),
  themeId: z
    .number({ invalid_type_error: "themeId deve ser inteiro" })
    .int()
    .positive()
    .optional()
    .nullable(),
  weatherData: z.record(z.unknown()).optional().nullable(),
});

export type CreateRunBody = z.infer<typeof createRunSchema>;

export const updateRunSchema = z.object({
  observations: z.string().max(1000).optional().nullable(),
  motivationalPhrase: z.string().max(300).optional().nullable(),
  photoUrl: z.string().url("photoUrl inválido").optional().nullable(),
  themeId: z
    .number({ invalid_type_error: "themeId deve ser inteiro" })
    .int()
    .positive()
    .optional()
    .nullable(),
});

export type UpdateRunBody = z.infer<typeof updateRunSchema>;

export const listRunsQuerySchema = z.object({
  themeId: z
    .string()
    .regex(/^\d+$/, "themeId deve ser inteiro")
    .transform(Number)
    .optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  search: z.string().max(100).optional(),
  limit: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .refine((n) => n >= 1 && n <= 100, "limit entre 1 e 100")
    .optional(),
  offset: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .optional(),
});

export type ListRunsQuery = z.infer<typeof listRunsQuerySchema>;

export const runIdParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "id deve ser inteiro positivo")
    .transform(Number),
});
