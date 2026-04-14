import { prisma } from '../config/prisma';
import { CreatePostInput } from '../schemas/post.schema';

const postInclude = {
  author: {
    select: { id: true, username: true, avatarUrl: true },
  },
  run: {
    select: { id: true, distanceKm: true, durationSec: true },
  },
  _count: {
    select: { reactions: true, comments: true },
  },
};

export const createPost = async (userId: number, data: CreatePostInput) => {
  return prisma.post.create({
    data: {
      ...data,
      authorId: userId,
    },
    include: postInclude,
  });
};

export const getPostById = async (id: number) => {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      ...postInclude,
      comments: {
        include: {
          user: { select: { id: true, username: true, avatarUrl: true } },
        },
        orderBy: { createdAt: 'asc' },
      },
      reactions: {
        select: { type: true, userId: true },
      },
    },
  });

  if (!post) throw new Error('Publicação não encontrada');
  return post;
};

export const deletePost = async (id: number, userId: number) => {
  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) throw new Error('Publicação não encontrada');
  if (post.authorId !== userId) {
    throw new Error('Sem permissão para eliminar esta publicação');
  }

  await prisma.post.delete({ where: { id } });
};