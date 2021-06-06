import { intArg, nonNull, objectType, stringArg } from 'nexus';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { APP_SECRET } from '../constants';
import { AuthUser } from '../User';

export const Mutation = objectType({
  name: 'Mutation',
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
    t.field('login', {
      type: 'AuthUser',
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: async (_, loginArgs, ctx) => {
        console.log('login START');

        const user = await ctx.prisma.user.findUnique({
          where: { email: loginArgs.email },
        });

        if (!user) {
          console.error('  No User');
          throw new Error('No User');
        }

        const valid: boolean = await bcrypt.compare(
          loginArgs.password,
          user.password
        );
        if (!valid) {
          console.error('  Not valid password');
          throw new Error('Not valid password');
        }

        console.log('user email: ' + user.email);
        const token = jwt.sign({ userId: user.id }, APP_SECRET);

        console.log('login END');
        return {
          token: token,
          user,
        };
      },
    });
  },
});
