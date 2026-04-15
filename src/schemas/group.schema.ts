import { z } from "zod";

const positiveIntSchema = z.coerce.number().int().positive();
const jsonObjectSchema = z.record(z.string(), z.unknown());

export const groupIdParamSchema = z.object({
  id: positiveIntSchema,
});

export const groupMemberParamSchema = z.object({
  id: positiveIntSchema,
  uid: positiveIntSchema,
});

export const groupEventParamSchema = z.object({
  id: positiveIntSchema,
  eid: positiveIntSchema,
});

export const createGroupSchema = z.object({
  name: z.string().trim().min(3).max(120),
  description: z.string().trim().max(500).optional().nullable(),
});

export const updateGroupSchema = z
  .object({
    name: z.string().trim().min(3).max(120).optional(),
    description: z.string().trim().max(500).optional().nullable(),
  })
  .refine((data) => data.name !== undefined || data.description !== undefined, {
    message: "Pelo menos um campo deve ser enviado para atualização.",
  });

export const addGroupMemberSchema = z.object({
  userId: positiveIntSchema,
});

export const createGroupEventSchema = z.object({
  title: z.string().trim().min(3).max(140),
  description: z.string().trim().max(1000).optional().nullable(),
  eventDate: z.string().datetime({ message: "eventDate inválido. Usa ISO 8601." }),
  themeId: positiveIntSchema.optional().nullable(),
  routeGeojson: jsonObjectSchema.optional().nullable(),
});

export const updateGroupEventSchema = z
  .object({
    title: z.string().trim().min(3).max(140).optional(),
    description: z.string().trim().max(1000).optional().nullable(),
    eventDate: z
      .string()
      .datetime({ message: "eventDate inválido. Usa ISO 8601." })
      .optional(),
    themeId: positiveIntSchema.optional().nullable(),
    routeGeojson: jsonObjectSchema.optional().nullable(),
  })
  .refine(
    (data) =>
      data.title !== undefined ||
      data.description !== undefined ||
      data.eventDate !== undefined ||
      data.themeId !== undefined ||
      data.routeGeojson !== undefined,
    {
      message: "Pelo menos um campo deve ser enviado para atualização.",
    }
  );
