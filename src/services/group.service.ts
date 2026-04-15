import { GroupMemberRole, Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";
import { AppError } from "../utils/http-error";

type UnknownRecord = Record<string, unknown>;

function asObject(value: unknown, message = "Payload invalido."): UnknownRecord {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new AppError(message, 400, "VALIDATION_ERROR");
  }
  return value as UnknownRecord;
}

function parsePositiveInt(value: unknown, fieldName: string): number {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string"
      ? Number(value)
      : Number.NaN;

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new AppError(`${fieldName} invalido.`, 400, "VALIDATION_ERROR");
  }

  return parsed;
}

function parseRequiredText(value: unknown, fieldName: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new AppError(`${fieldName} e obrigatorio.`, 400, "VALIDATION_ERROR");
  }
  return value.trim();
}

function parseOptionalText(value: unknown, fieldName: string): string | null {
  if (value === undefined) return null;
  if (value === null) return null;
  if (typeof value !== "string") {
    throw new AppError(`${fieldName} invalido.`, 400, "VALIDATION_ERROR");
  }
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

function parseDate(value: unknown, fieldName: string): Date {
  if (typeof value !== "string" && !(value instanceof Date)) {
    throw new AppError(`${fieldName} invalido.`, 400, "VALIDATION_ERROR");
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new AppError(`${fieldName} invalido.`, 400, "VALIDATION_ERROR");
  }

  return date;
}

async function getGroupOrThrow(groupId: number) {
  const group = await prisma.group.findUnique({
    where: { id: groupId },
    select: { id: true, createdById: true },
  });

  if (!group) {
    throw new AppError("Grupo nao encontrado.", 404, "GROUP_NOT_FOUND");
  }

  return group;
}

async function ensureOrganizer(groupId: number, userId: number) {
  const group = await getGroupOrThrow(groupId);

  if (group.createdById === userId) {
    return group;
  }

  const membership = await prisma.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId } },
    select: { role: true },
  });

  if (membership?.role !== GroupMemberRole.ORGANIZER) {
    throw new AppError(
      "Acesso negado. Apenas organizadores podem gerir este grupo.",
      403,
      "FORBIDDEN"
    );
  }

  return group;
}

async function ensureMember(groupId: number, userId: number) {
  const membership = await prisma.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId } },
    select: { userId: true },
  });

  if (!membership) {
    throw new AppError(
      "Apenas membros do grupo podem participar no evento.",
      403,
      "FORBIDDEN"
    );
  }
}

async function getEventOrThrow(groupId: number, eventId: number) {
  const event = await prisma.groupEvent.findFirst({
    where: { id: eventId, groupId },
    select: { id: true },
  });

  if (!event) {
    throw new AppError("Evento nao encontrado.", 404, "GROUP_EVENT_NOT_FOUND");
  }

  return event;
}

const groupListInclude = {
  createdBy: {
    select: { id: true, username: true, avatarUrl: true },
  },
  _count: {
    select: { members: true, events: true },
  },
} as const;

const groupDetailInclude = {
  ...groupListInclude,
  members: {
    include: {
      user: {
        select: { id: true, username: true, avatarUrl: true },
      },
    },
    orderBy: { joinedAt: "asc" },
  },
} as const;

const eventInclude = {
  theme: {
    select: { id: true, name: true, emoji: true, colorHex: true },
  },
  createdBy: {
    select: { id: true, username: true, avatarUrl: true },
  },
  _count: {
    select: { participations: true, posts: true },
  },
} as const;

export const groupService = {
  async list() {
    return prisma.group.findMany({
      include: groupListInclude,
      orderBy: { createdAt: "desc" },
    });
  },

  async create(userId: number, body: unknown) {
    const payload = asObject(body, "Dados invalidos para criar grupo.");
    const name = parseRequiredText(payload.name, "name");
    const description = parseOptionalText(payload.description, "description");

    const group = await prisma.$transaction(async (tx) => {
      const created = await tx.group.create({
        data: {
          name,
          description,
          createdById: userId,
        },
      });

      await tx.groupMember.create({
        data: {
          groupId: created.id,
          userId,
          role: GroupMemberRole.ORGANIZER,
        },
      });

      return tx.group.findUnique({
        where: { id: created.id },
        include: groupDetailInclude,
      });
    });

    if (!group) {
      throw new AppError("Falha ao criar grupo.", 500, "GROUP_CREATE_FAILED");
    }

    return group;
  },

  async getById(id: number) {
    const group = await prisma.group.findUnique({
      where: { id },
      include: {
        ...groupDetailInclude,
        events: {
          include: eventInclude,
          orderBy: { eventDate: "asc" },
        },
      },
    });

    if (!group) {
      throw new AppError("Grupo nao encontrado.", 404, "GROUP_NOT_FOUND");
    }

    return group;
  },

  async update(id: number, userId: number, body: unknown) {
    await ensureOrganizer(id, userId);

    const payload = asObject(body, "Dados invalidos para atualizar grupo.");
    const data: Prisma.GroupUpdateInput = {};

    if (Object.prototype.hasOwnProperty.call(payload, "name")) {
      data.name = parseRequiredText(payload.name, "name");
    }

    if (Object.prototype.hasOwnProperty.call(payload, "description")) {
      data.description = parseOptionalText(payload.description, "description");
    }

    if (!Object.keys(data).length) {
      throw new AppError("Nenhum campo valido para atualizar.", 400, "VALIDATION_ERROR");
    }

    return prisma.group.update({
      where: { id },
      data,
      include: groupDetailInclude,
    });
  },

  async delete(id: number, userId: number) {
    await ensureOrganizer(id, userId);
    await prisma.group.delete({ where: { id } });
  },

  async addMember(groupId: number, userId: number, newUserIdRaw: unknown) {
    await ensureOrganizer(groupId, userId);

    const newUserId = parsePositiveInt(newUserIdRaw, "userId");

    const targetUser = await prisma.user.findUnique({
      where: { id: newUserId },
      select: { id: true },
    });

    if (!targetUser) {
      throw new AppError("Utilizador nao encontrado.", 404, "USER_NOT_FOUND");
    }

    const existing = await prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId: newUserId } },
      select: { userId: true },
    });

    if (existing) {
      throw new AppError("Utilizador ja pertence ao grupo.", 409, "MEMBER_ALREADY_EXISTS");
    }

    return prisma.groupMember.create({
      data: {
        groupId,
        userId: newUserId,
        role: GroupMemberRole.MEMBER,
      },
      include: {
        user: {
          select: { id: true, username: true, avatarUrl: true },
        },
      },
    });
  },

  async removeMember(groupId: number, userId: number, removeUserIdRaw: unknown) {
    const group = await ensureOrganizer(groupId, userId);
    const removeUserId = parsePositiveInt(removeUserIdRaw, "uid");

    if (group.createdById === removeUserId) {
      throw new AppError(
        "Nao e permitido remover o criador do grupo.",
        422,
        "INVALID_OPERATION"
      );
    }

    const member = await prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId: removeUserId } },
    });

    if (!member) {
      throw new AppError("Membro nao encontrado no grupo.", 404, "GROUP_MEMBER_NOT_FOUND");
    }

    if (member.role === GroupMemberRole.ORGANIZER) {
      const organizerCount = await prisma.groupMember.count({
        where: { groupId, role: GroupMemberRole.ORGANIZER },
      });

      if (organizerCount <= 1) {
        throw new AppError(
          "O grupo deve manter pelo menos um organizador.",
          422,
          "INVALID_OPERATION"
        );
      }
    }

    await prisma.groupMember.delete({
      where: { groupId_userId: { groupId, userId: removeUserId } },
    });
  },

  async listEvents(groupId: number) {
    await getGroupOrThrow(groupId);

    return prisma.groupEvent.findMany({
      where: { groupId },
      include: eventInclude,
      orderBy: [{ eventDate: "asc" }, { createdAt: "asc" }],
    });
  },

  async createEvent(groupId: number, userId: number, body: unknown) {
    await ensureOrganizer(groupId, userId);

    const payload = asObject(body, "Dados invalidos para criar evento.");
    const title = parseRequiredText(payload.title, "title");
    const description = parseOptionalText(payload.description, "description");
    const eventDate = parseDate(payload.eventDate, "eventDate");

    const themeId =
      payload.themeId === undefined || payload.themeId === null
        ? null
        : parsePositiveInt(payload.themeId, "themeId");

    if (themeId) {
      const theme = await prisma.theme.findUnique({
        where: { id: themeId },
        select: { id: true },
      });

      if (!theme) {
        throw new AppError("Tema nao encontrado.", 404, "THEME_NOT_FOUND");
      }
    }

    const data: Prisma.GroupEventCreateInput = {
      group: { connect: { id: groupId } },
      createdBy: { connect: { id: userId } },
      title,
      description,
      eventDate,
      theme: themeId ? { connect: { id: themeId } } : undefined,
    };

    if (payload.routeGeojson !== undefined) {
      data.routeGeojson = payload.routeGeojson as Prisma.InputJsonValue;
    }

    return prisma.groupEvent.create({
      data,
      include: eventInclude,
    });
  },

  async updateEvent(groupId: number, eventId: number, userId: number, body: unknown) {
    await ensureOrganizer(groupId, userId);
    await getEventOrThrow(groupId, eventId);

    const payload = asObject(body, "Dados invalidos para atualizar evento.");
    const data: Prisma.GroupEventUpdateInput = {};

    if (Object.prototype.hasOwnProperty.call(payload, "title")) {
      data.title = parseRequiredText(payload.title, "title");
    }

    if (Object.prototype.hasOwnProperty.call(payload, "description")) {
      data.description = parseOptionalText(payload.description, "description");
    }

    if (Object.prototype.hasOwnProperty.call(payload, "eventDate")) {
      data.eventDate = parseDate(payload.eventDate, "eventDate");
    }

    if (Object.prototype.hasOwnProperty.call(payload, "themeId")) {
      if (payload.themeId === null) {
        data.theme = { disconnect: true };
      } else {
        const themeId = parsePositiveInt(payload.themeId, "themeId");
        const theme = await prisma.theme.findUnique({
          where: { id: themeId },
          select: { id: true },
        });

        if (!theme) {
          throw new AppError("Tema nao encontrado.", 404, "THEME_NOT_FOUND");
        }

        data.theme = { connect: { id: themeId } };
      }
    }

    if (Object.prototype.hasOwnProperty.call(payload, "routeGeojson")) {
      if (payload.routeGeojson === null) {
        data.routeGeojson = Prisma.JsonNull;
      } else {
        data.routeGeojson = payload.routeGeojson as Prisma.InputJsonValue;
      }
    }

    if (!Object.keys(data).length) {
      throw new AppError("Nenhum campo valido para atualizar.", 400, "VALIDATION_ERROR");
    }

    return prisma.groupEvent.update({
      where: { id: eventId },
      data,
      include: eventInclude,
    });
  },

  async deleteEvent(groupId: number, eventId: number, userId: number) {
    await ensureOrganizer(groupId, userId);
    await getEventOrThrow(groupId, eventId);
    await prisma.groupEvent.delete({ where: { id: eventId } });
  },

  async joinEvent(groupId: number, eventId: number, userId: number) {
    await getGroupOrThrow(groupId);
    await getEventOrThrow(groupId, eventId);
    await ensureMember(groupId, userId);

    const now = new Date();

    return prisma.eventParticipation.upsert({
      where: { eventId_userId: { eventId, userId } },
      create: {
        event: { connect: { id: eventId } },
        user: { connect: { id: userId } },
        confirmedAt: now,
      },
      update: { confirmedAt: now },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            eventDate: true,
            groupId: true,
          },
        },
      },
    });
  },
};
