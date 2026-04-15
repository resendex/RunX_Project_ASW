export const groupService = {
  async list() { return { message: "groups list" }; },
  async create(userId, body) { return { message: "group created" }; },
  async getById(id) { return { message: "group" }; },
  async update(id, userId, body) { return { message: "updated" }; },
  async delete(id, userId) { },

  async addMember(groupId, userId, newUserId) { return { message: "member added" }; },
  async removeMember(groupId, userId, removeUserId) {},

  async listEvents(groupId) { return { message: "events" }; },
  async createEvent(groupId, userId, body) { return { message: "event created" }; },
  async updateEvent(groupId, eid, userId, body) { return { message: "event updated" }; },
  async deleteEvent(groupId, eid, userId) {},

  async joinEvent(groupId, eid, userId) { return { message: "joined" }; },
};
