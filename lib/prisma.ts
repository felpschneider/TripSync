import { PrismaClient } from '@prisma/client'

// PrismaClient é anexado ao objeto global em desenvolvimento para evitar
// múltiplas instâncias durante o hot-reloading
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

