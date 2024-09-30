'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { CommentSchema } from '@/lib/schemas';
import { auth } from '../../auth';

export async function writeComment(postID: string, comment: string) {
  try {
    if (!postID || typeof postID !== 'string') {
      return {
        success: false,
        error: 'ID inválido.',
      };
    }

    const result = CommentSchema.safeParse({ postID, comment });
    if (!result.success) {
      return {
        success: false,
        error: 'Comentário inválido.',
      };
    }

    const session = await auth();

    if (!session?.user || !session?.user.id) {
      return {
        success: false,
        error: 'Você precisa estar autenticado.',
      };
    }

    await prisma.comment.create({
      data: {
        postId: postID,
        userId: session.user.id,
        content: comment,
      },
    });

    revalidatePath(`/post/${postID}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      '[WRITE-COMMENT] An error occurred:',
      error instanceof Error ? error.message : error,
    );

    return {
      success: false,
      error: 'Algo deu errado. Tente novamente mais tarde.',
    };
  }
}
