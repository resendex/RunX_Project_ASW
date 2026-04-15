import type { PublicUser } from "../models/user.model";
import { userModel } from "../models/user.model";
import type { UpdateAvatarBody, UpdateMeBody } from "../schemas/user.schema";
import { AppError } from "../utils/http-error";

export const userService = {
  async getMe(userId: number): Promise<PublicUser> {
    const user = await userModel.findProfileById(userId);

    if (!user) {
      throw new AppError("Utilizador nao encontrado.", 404, "USER_NOT_FOUND");
    }

    return user;
  },

  async updateMe(userId: number, input: UpdateMeBody): Promise<PublicUser> {
    const user = await userModel.findById(userId);
    if (!user) {
      throw new AppError("Utilizador nao encontrado.", 404, "USER_NOT_FOUND");
    }

    const nextEmail = input.email ?? user.email;
    const nextUsername = input.username ?? user.username;

    const existing = await userModel.findByEmailOrUsername(nextEmail, nextUsername, userId);

    if (input.email && existing?.email === input.email) {
      throw new AppError("Ja existe um utilizador com este email.", 409, "EMAIL_TAKEN");
    }

    if (input.username && existing?.username === input.username) {
      throw new AppError(
        "Ja existe um utilizador com este username.",
        409,
        "USERNAME_TAKEN"
      );
    }

    return userModel.updateProfileById(userId, {
      username: input.username,
      email: input.email,
      bio: input.bio,
      location: input.location
    });
  },

  async updateAvatar(userId: number, input: UpdateAvatarBody): Promise<PublicUser> {
    const user = await userModel.findById(userId);
    if (!user) {
      throw new AppError("Utilizador nao encontrado.", 404, "USER_NOT_FOUND");
    }

    return userModel.updateProfileById(userId, {
      avatarUrl: input.avatarUrl
    });
  },

  async deleteMe(userId: number): Promise<void> {
    const user = await userModel.findById(userId);

    if (!user) {
      throw new AppError("Utilizador nao encontrado.", 404, "USER_NOT_FOUND");
    }

    await userModel.deleteById(userId);
  }
};