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
export const getFeed = async (userId: number, page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const groupIds = (
    await prisma.groupMember.findMany({
      where: { userId },
      select: { groupId: true },
    })
  ).map((gm) => gm.groupId);

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: {
        OR: [
          { visibility: 'PUBLIC' },
          { visibility: 'GROUP', groupId: { in: groupIds } },
          { authorId: userId },
        ],
      },
      include: postInclude,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.post.count({
      where: {
        OR: [
          { visibility: 'PUBLIC' },
          { visibility: 'GROUP', groupId: { in: groupIds } },
          { authorId: userId },
        ],
      },
    }),
  ]);

  return {
    posts,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
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
