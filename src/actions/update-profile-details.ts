'use server';

import { UserProfileDetailsSchema } from '@/lib/schemas';
import { auth } from '../../auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateProfileDetails(formData: FormData) {
  try {
    const rawFormData = Object.fromEntries(formData);
    const result = UserProfileDetailsSchema.safeParse(rawFormData);

    if (!result.success) {
      return {
        success: false,
        error: 'Algo deu errado. Tente novamente mais tarde.',
      };
    }

    const session = await auth();

    if (!session?.user || !session?.user.id) {
      return {
        success: false,
        error: 'Você precisa estar autenticado.',
      };
    }

    const { country, birthdate, biography, sex } = result.data;

    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        country: country === 'none' ? null : country,
        birthdate,
        biography,
        sex: sex === 'none' ? null : sex,
      },
    });

    revalidatePath(`/profile/${updatedUser.id}`);

    return {
      success: true,
      data: {
        country: updatedUser.country,
        birthdate: updatedUser.birthdate,
        biography: updatedUser.biography,
        sex: updatedUser.sex,
      },
    };
  } catch (error) {
    console.error(
      '[UPDATE-PROFILE-DETAILS] An error occurred:',
      error instanceof Error ? error.message : error,
    );

    return {
      success: false,
      error: 'Algo deu errado. Tente novamente mais tarde.',
    };
  }
}
