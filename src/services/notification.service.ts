import { prisma } from '../config/prisma';

export const getNotifications = async (
  userId: number,
  page: number,
  limit: number
) => {
  const skip = (page - 1) * limit;

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.notification.count({
      where: { userId },
    }),
  ]);

  return {
    data: notifications,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
};
