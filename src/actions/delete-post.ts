'use server';

import { del } from '@vercel/blob';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { auth } from '../../auth';

export async function deletePost(postID: string) {
  try {
    if (!postID || typeof postID !== 'string') {
      return {
        success: false,
        error: 'ID inválido.',
      };
    }

    const session = await auth();

    if (!session?.user) {
      return {
        success: false,
        error: 'Você precisa estar autenticado.',
      };
    }

    const post = await prisma.post.delete({
      where: {
        id: postID,
        userId: session.user.id,
      },
      include: {
        files: {
          select: {
            url: true,
          },
        },
      },
    });

    if (!post) {
      return {
        success: false,
        error: 'Esse post não existe.',
      };
    }

    for (const file of post.files) {
      await del(file.url);
    }

    revalidatePath('/profile');

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      '[DELETE-POST] An error occurred:',
      error instanceof Error ? error.message : error,
    );

    return {
      success: false,
      error: 'Algo deu errado. Tente novamente mais tarde.',
    };
  }
}
