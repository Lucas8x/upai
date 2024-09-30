import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

/* export const prisma = new PrismaClient({
  log: ['query'],
}); */

const prismaClientSingleton = () =>
  new PrismaClient({
    //log: ['query'],
  }).$extends(withAccelerate());

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}
