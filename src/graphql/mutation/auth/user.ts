import { createContext } from '../../../context'
const { prisma } = createContext()

export async function findUserBy(email: string) {
  return await prisma.user.findUnique({
    where: { email: email },
  })
}

export async function findUserWith(phoneNumber: string) {
  return await prisma.user.findUnique({
    where: { phoneNumber: phoneNumber },
  })
}