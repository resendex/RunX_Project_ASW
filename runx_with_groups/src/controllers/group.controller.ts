import { groupService } from "../services/group.service";

export const groupController = {
  async list(req, res, next) {
    try {
      const data = await groupService.list();
      res.json(data);
    } catch (e) { next(e); }
  },

  async create(req, res, next) {
    try {
      const data = await groupService.create(req.auth.userId, req.body);
      res.status(201).json(data);
    } catch (e) { next(e); }
  },

  async getById(req, res, next) {
    try {
      const data = await groupService.getById(Number(req.params.id));
      res.json(data);
    } catch (e) { next(e); }
  },

  async update(req, res, next) {
    try {
      const data = await groupService.update(Number(req.params.id), req.auth.userId, req.body);
      res.json(data);
    } catch (e) { next(e); }
  },

  async delete(req, res, next) {
    try {
      await groupService.delete(Number(req.params.id), req.auth.userId);
      res.status(204).send();
    } catch (e) { next(e); }
  },

  async addMember(req, res, next) {
    try {
      const data = await groupService.addMember(Number(req.params.id), req.auth.userId, req.body.userId);
      res.json(data);
    } catch (e) { next(e); }
  },

  async removeMember(req, res, next) {
    try {
      await groupService.removeMember(Number(req.params.id), req.auth.userId, Number(req.params.uid));
      res.status(204).send();
    } catch (e) { next(e); }
  },

  async listEvents(req, res, next) {
    try {
      const data = await groupService.listEvents(Number(req.params.id));
      res.json(data);
    } catch (e) { next(e); }
  },

  async createEvent(req, res, next) {
    try {
      const data = await groupService.createEvent(Number(req.params.id), req.auth.userId, req.body);
      res.status(201).json(data);
    } catch (e) { next(e); }
  },

  async updateEvent(req, res, next) {
    try {
      const data = await groupService.updateEvent(Number(req.params.id), Number(req.params.eid), req.auth.userId, req.body);
      res.json(data);
    } catch (e) { next(e); }
  },

  async deleteEvent(req, res, next) {
    try {
      await groupService.deleteEvent(Number(req.params.id), Number(req.params.eid), req.auth.userId);
      res.status(204).send();
    } catch (e) { next(e); }
  },

  async joinEvent(req, res, next) {
    try {
      const data = await groupService.joinEvent(Number(req.params.id), Number(req.params.eid), req.auth.userId);
      res.json(data);
    } catch (e) { next(e); }
  },
};
