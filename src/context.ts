import { PrismaClient } from '@prisma/client'

const prisma = process.env.TS_NODE_DEV === 'true'
 ? new PrismaClient()
 : new PrismaClient({log: ['query']})

export interface Context {
  prisma: PrismaClient
}

export function createContext(): Context {
  return { prisma }
}
