import { prisma } from '../config/prisma';

export const addComment = async (
  postId: number,
  userId: number,
  content: string
) => {
  return prisma.postComment.create({
    data: {
      postId,
      userId,
      content,
    },
    include: {
      user: {
        select: { id: true, username: true, avatarUrl: true },
      },
    },
  });
};

export const deleteComment = async (
  commentId: number,
  userId: number
) => {
  const comment = await prisma.postComment.findUnique({
    where: { id: commentId },
  });

  if (!comment) throw new Error('Comentário não encontrado');

  if (comment.userId !== userId) {
    throw new Error('Sem permissão para eliminar este comentário');
  }

  await prisma.postComment.delete({
    where: { id: commentId },
  });
};