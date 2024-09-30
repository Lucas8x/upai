import { prisma } from '@/lib/prisma';
import { POSTS_PER_PAGE, SORT_OPTIONS } from '@/constants';

type Sort = (typeof SORT_OPTIONS)[number];

export async function getHomepagePosts(skip = 0, sort?: Sort) {
  const sortBy = sort && SORT_OPTIONS.includes(sort) ? sort : 'desc';

  const posts = await prisma.post.findMany({
    take: POSTS_PER_PAGE,
    skip,
    orderBy: {
      createdAt: sortBy,
    },
    include: {
      files: {
        select: {
          url: true,
          blurHash: true,
          size: true,
        },
      },
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
    cacheStrategy: {
      ttl: 60, // Consider data fresh for x seconds
      swr: 60, // Serve stale data for up to x seconds while fetching fresh data
    },
  });

  const count = await prisma.post.count({
    cacheStrategy: {
      ttl: 60 * 60, // 1h
      swr: 60 * 60, // 1h
    },
  });

  return { posts, count };
}
