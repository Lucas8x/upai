import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { del } from '@vercel/blob';
import { POST_EXPIRATION_TIME } from '@/config';
import { prisma } from '@/lib/prisma';

export async function deleteOutdatedPosts() {
  try {
    const posts = await prisma.post.findMany({
      where: {
        createdAt: {
          lt: new Date(Date.now() - POST_EXPIRATION_TIME),
        },
      },
      include: {
        files: true,
      },
    });

    const files = posts.flatMap((p) => p.files.map((f) => f.url));

    for (const file of files) {
      await del(file).then(() => {});
    }

    const result = await prisma.post.deleteMany({
      where: {
        id: {
          in: posts.map((post) => post.id),
        },
      },
    });

    console.log(
      `Successfully deleted ${files.length} files and ${result.count} posts.`,
    );

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error('[DELETE-OUTDATED-POSTS] An error occurred:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

const filePath = path.normalize(fileURLToPath(import.meta.url)).toLowerCase();
const executedPath = path.normalize(process.argv[1]).toLowerCase();

const directRun = filePath === executedPath;

if (directRun) {
  deleteOutdatedPosts();
}
