import { prisma } from '@/lib/prisma';

export async function getUserStorageUsage(
  userId: string,
): Promise<[string, null] | [null, number]> {
  if (!userId || typeof userId !== 'string') {
    return ['Please provide a valid userId', null];
  }

  const {
    _sum: { size },
  } = await prisma.file.aggregate({
    _sum: {
      size: true,
    },
    where: {
      post: {
        userId,
      },
    },
  });

  return [null, size === null ? 0 : size];
}
