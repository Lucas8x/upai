import { prisma } from '@/lib/prisma';

export async function getUserPosts(userId: string) {
  if (!userId || typeof userId !== 'string') {
    return [];
  }

  const userPosts = await prisma.post.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      files: {
        select: {
          url: true,
          blurHash: true,
          size: true,
        },
      },
    },
  });

  return userPosts;
}
