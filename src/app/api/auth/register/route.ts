/* import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { LoginCredentialsFormSchema } from '@/lib/schemas';
import { saltAndHashPassword } from '@/utils/password';
import { id } from 'date-fns/locale';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const result = LoginCredentialsFormSchema.safeParse(data);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error.issues[0].message,
        },
        {
          status: 400,
        },
      );
    }

    const { username, password } = result.data;

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Usuário ja existe',
        },
        {
          status: 400,
        },
      );
    }

    const newUser = await prisma.user.create({
      data: {
        name: username,
        username,
        password: await saltAndHashPassword(password),
      },
    });

    console.log('[AUTH][REGISTER] Usuário criado:', newUser.id);

    return NextResponse.json({
      id: newUser.id,
      username: newUser.username,
    });
  } catch (error) {
    console.error(
      '[AUTH][REGISTER]',
      error instanceof Error ? error.message : error,
    );

    return NextResponse.json(
      {
        error: 'Algo deu errado. Tente novamente mais tarde.',
      },
      {
        status: 500,
      },
    );
  }
} */
