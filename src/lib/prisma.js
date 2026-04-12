import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient({
    // Forçamos a conexão aqui para que o Prisma 7 ignore a falta da URL no schema.prisma
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    // Log esperto: mostra as queries no terminal apenas em desenvolvimento
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

const globalForPrisma = globalThis

// Se já existir uma instância (Hot Reload do Next.js), usa ela. Se não, cria uma nova.
export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma