import { prisma } from '@/lib/prisma';

export async function getProfilePageData(userId: string) {
  if (!userId || typeof userId !== 'string') {
    return null;
  }

  const profile = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      image: true,
      biography: true,
      birthdate: true,
      country: true,
      sex: true,
      posts: {
        select: {
          id: true,
          title: true,
          createdAt: true,
          files: {
            select: {
              url: true,
              blurHash: true,
              size: true,
            },
          },
        },
      },
      _count: {
        select: { comments: true },
      },
    },
  });

  return profile;
}
