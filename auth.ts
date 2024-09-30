import NextAuth from 'next-auth';
import Github from 'next-auth/providers/github';
import Discord from 'next-auth/providers/discord';
import Google from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import { LoginCredentialsFormSchema } from '@/lib/schemas';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Github,
    Discord({
      authorization: {
        params: {
          scope: 'identify email',
        },
      },
    }),
    //Google,
    /* CredentialsProvider({
      name: 'credentials',
      id: 'credentials',
      credentials: {
        username: { type: 'text' },
        password: { type: 'text' },
      },
      authorize: async (credentials, req) => {
        try {
          const result = LoginCredentialsFormSchema.safeParse(credentials);

          if (!result.success) {
            throw new Error('');
          }

          const { username, password } = result.data;

          const user = await prisma.user.findUnique({
            where: {
              username,
            },
          });

          if (!user) {
            throw new Error('Usuário não encontrado.');
          }

          if (!user.password) {
            throw new Error(
              'Usuário sem senha. Provavelmente autentificado por OAuth.',
            );
          }

          const pwMatch = await bcrypt.compare(password, user.password);

          if (!pwMatch) {
            throw new Error('Senha incorreta.');
          }

          return {
            id: user.id,
            name: user.name,
            image: user.image,
          };
        } catch (error) {
          return null;
        }
      },
    }), */
  ],
  /* session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && account.type === 'credentials') {
        token.userId = account.providerAccountId;
      }
      return token;
    },
    async session({ session, token, user }) {
      session.user.id = token.userId;
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  }, */
});
