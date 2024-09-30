import { prisma } from '@/lib/prisma';

export async function getPostPageData(postID: string) {
  if (!postID || typeof postID !== 'string') {
    return null;
  }

  const post = await prisma.post.findUnique({
    where: {
      id: postID,
    },
    select: {
      id: true,
      title: true,
      description: true,
      createdAt: true,
      files: {
        select: {
          id: true,
          url: true,
          blurHash: true,
        },
      },
      comments: {
        select: {
          id: true,
          content: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  return post;
}
