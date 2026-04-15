import type { NextFunction, Request, Response } from "express";
import { groupService } from "../services/group.service";

function parseId(raw: unknown): number | null {
  const value = Array.isArray(raw) ? raw[0] : raw;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
}

export const groupController = {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const groups = await groupService.list();
      res.json({ groups });
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const group = await groupService.create(req.auth!.userId, req.body);
      res.status(201).json({ group });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseId(req.params.id);
      if (!id) {
        res.status(400).json({ error: { message: "ID de grupo invalido." } });
        return;
      }

      const group = await groupService.getById(id);
      res.json({ group });
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseId(req.params.id);
      if (!id) {
        res.status(400).json({ error: { message: "ID de grupo invalido." } });
        return;
      }

      const group = await groupService.update(id, req.auth!.userId, req.body);
      res.json({ group });
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseId(req.params.id);
      if (!id) {
        res.status(400).json({ error: { message: "ID de grupo invalido." } });
        return;
      }

      await groupService.delete(id, req.auth!.userId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

  async addMember(req: Request, res: Response, next: NextFunction) {
    try {
      const groupId = parseId(req.params.id);
      if (!groupId) {
        res.status(400).json({ error: { message: "ID de grupo invalido." } });
        return;
      }

      const member = await groupService.addMember(
        groupId,
        req.auth!.userId,
        (req.body as { userId?: unknown }).userId
      );

      res.status(201).json({ member });
    } catch (err) {
      next(err);
    }
  },

  async removeMember(req: Request, res: Response, next: NextFunction) {
    try {
      const groupId = parseId(req.params.id);
      const removeUserId = parseId(req.params.uid);

      if (!groupId || !removeUserId) {
        res.status(400).json({ error: { message: "IDs invalidos." } });
        return;
      }

      await groupService.removeMember(groupId, req.auth!.userId, removeUserId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

  async listEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const groupId = parseId(req.params.id);
      if (!groupId) {
        res.status(400).json({ error: { message: "ID de grupo invalido." } });
        return;
      }

      const events = await groupService.listEvents(groupId);
      res.json({ events });
    } catch (err) {
      next(err);
    }
  },

  async createEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const groupId = parseId(req.params.id);
      if (!groupId) {
        res.status(400).json({ error: { message: "ID de grupo invalido." } });
        return;
      }

      const event = await groupService.createEvent(groupId, req.auth!.userId, req.body);
      res.status(201).json({ event });
    } catch (err) {
      next(err);
    }
  },

  async updateEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const groupId = parseId(req.params.id);
      const eventId = parseId(req.params.eid);

      if (!groupId || !eventId) {
        res.status(400).json({ error: { message: "IDs invalidos." } });
        return;
      }

      const event = await groupService.updateEvent(groupId, eventId, req.auth!.userId, req.body);
      res.json({ event });
    } catch (err) {
      next(err);
    }
  },

  async deleteEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const groupId = parseId(req.params.id);
      const eventId = parseId(req.params.eid);

      if (!groupId || !eventId) {
        res.status(400).json({ error: { message: "IDs invalidos." } });
        return;
      }

      await groupService.deleteEvent(groupId, eventId, req.auth!.userId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

  async joinEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const groupId = parseId(req.params.id);
      const eventId = parseId(req.params.eid);

      if (!groupId || !eventId) {
        res.status(400).json({ error: { message: "IDs invalidos." } });
        return;
      }

      const participation = await groupService.joinEvent(groupId, eventId, req.auth!.userId);
      res.json({ participation });
    } catch (err) {
      next(err);
    }
  },
};
