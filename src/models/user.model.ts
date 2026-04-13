import { Prisma, type User, type UserRole } from "@prisma/client";
import { prisma } from "../config/prisma";

export const userPublicSelect = {
  id: true,
  username: true,
  email: true,
  role: true,
  bio: true,
  avatarUrl: true,
  location: true,
  createdAt: true,
  updatedAt: true
} satisfies Prisma.UserSelect;

export type PublicUser = Prisma.UserGetPayload<{
  select: typeof userPublicSelect;
}>;

interface CreateUserInput {
  username: string;
  email: string;
  passwordHash: string;
  role?: UserRole;
}

interface UpdateUserProfileInput {
  username?: string;
  email?: string;
  bio?: string | null;
  avatarUrl?: string | null;
  location?: string | null;
}

export const userModel = {
  create(data: CreateUserInput): Promise<User> {
    return prisma.user.create({ data });
  },

  findById(id: number): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  },

  findProfileById(id: number): Promise<PublicUser | null> {
    return prisma.user.findUnique({
      where: { id },
      select: userPublicSelect
    });
  },

  findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  },

  findByUsername(username: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { username } });
  },

  findByEmailOrUsername(
    email: string,
    username: string,
    excludeUserId?: number
  ): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
        ...(excludeUserId ? { NOT: { id: excludeUserId } } : {})
      }
    });
  },

  updateProfileById(id: number, data: UpdateUserProfileInput): Promise<PublicUser> {
    return prisma.user.update({
      where: { id },
      data,
      select: userPublicSelect
    });
  },

  deleteById(id: number): Promise<User> {
    return prisma.user.delete({ where: { id } });
  }
};