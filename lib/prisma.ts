import { PrismaClient } from '@prisma/client'

// PrismaClient é anexado ao objeto global em desenvolvimento para evitar
// múltiplas instâncias durante o hot-reloading
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Configuração do Prisma Client com opções otimizadas para serverless
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

