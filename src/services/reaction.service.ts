import { prisma } from '../config/prisma';

export const addReaction = async (
  postId: number,
  userId: number,
  type: string
) => {
  return prisma.postReaction.upsert({
    where: {
      postId_userId: { postId, userId },
    },
    update: { type },
    create: { postId, userId, type },
  });
};

export const removeReaction = async (
  postId: number,
  userId: number
) => {
  await prisma.postReaction.deleteMany({
    where: { postId, userId },
  });
};