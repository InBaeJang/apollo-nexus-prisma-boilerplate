import { extendType, intArg, nonNull, stringArg } from 'nexus';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { APP_SECRET } from '../../constants';
import { createContext } from '../../../context'
const { prisma } = createContext()

async function findUserBy(email: string) {
  return await prisma.user.findUnique({
    where: { email: email },
  })
}

async function findUserWith(phoneNumber: string) {
  return await prisma.user.findUnique({
    where: { phoneNumber: phoneNumber },
  })
}

async function saveUser(signupArgs: any) {
  const pwd: string = await bcrypt.hash(signupArgs.password, 10);
  return await prisma.user.create({
    data: {
      email: signupArgs.email,
      password: pwd,
      phoneNumber: signupArgs.phoneNumber,
      name: signupArgs.name,
      birth: signupArgs.birth,
      gender: signupArgs.gender,
      status: 'new',
    },
  });
}

export const Signup = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('signup', {
      type: 'AuthUser',
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
        phoneNumber: nonNull(stringArg()),
        name: stringArg(),
        birth: intArg(),
        gender: stringArg(),
      },
      resolve: async (_, signupArgs, ctx) => {
        console.log('signup START');

        // let user = await ctx.prisma.user.findUnique({
        //   where: { email: signupArgs.email },
        // });
        let user = await findUserBy(signupArgs.email)
        if (user) {
          throw new Error('Already Signed up (email)');
        }

        // user = await ctx.prisma.user.findUnique({
        //   where: { phoneNumber: signupArgs.phoneNumber },
        // });
        user = await findUserWith(signupArgs.phoneNumber)
        if (user) {
          throw new Error('Already Signed up (phoneNumber)');
        }

        user = await saveUser(signupArgs)

        console.log('user: ' + JSON.stringify(user));
        console.log('signup END');
        return {
          token: jwt.sign({ userId: user.id }, APP_SECRET),
          user,
        };
      },
    });
  },
});