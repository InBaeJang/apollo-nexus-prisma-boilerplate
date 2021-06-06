import { extendType, intArg, nonNull, stringArg } from 'nexus';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { APP_SECRET } from '../../constants';

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

        let user = await ctx.prisma.user.findUnique({
          where: { email: signupArgs.email },
        });

        if (user) {
          throw new Error('Already Signed up (email)');
        }

        user = await ctx.prisma.user.findUnique({
          where: { phoneNumber: signupArgs.phoneNumber },
        });

        if (user) {
          throw new Error('Already Signed up (phoneNumber)');
        }

        const pwd: string = await bcrypt.hash(signupArgs.password, 10);
        user = await ctx.prisma.user.create({
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