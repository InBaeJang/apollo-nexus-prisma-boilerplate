import { PrismaClient } from '@prisma/client'

const prisma = process.env.TS_NODE_DEV === 'true'
  ? new PrismaClient({ log: ['query', 'info'] })
  : new PrismaClient()


export interface Context {
  prisma: PrismaClient
}

export function createContext(): Context {
  return { prisma }
}
