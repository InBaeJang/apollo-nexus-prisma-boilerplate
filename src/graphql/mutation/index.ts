import { intArg, nonNull, objectType, stringArg } from 'nexus';
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { APP_SECRET } from '../constants';

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
      resolve: async (
        _,
        { email, password, phoneNumber, name, birth, gender },
        ctx
      ) => {
        console.log('signup START');
        let user = await ctx.prisma.user.findUnique({
          where: { email: email },
        });

        if (user) {
          throw new Error('Already Signed up (email)');
        }

        user = await ctx.prisma.user.findUnique({
          where: { phoneNumber: phoneNumber },
        });

        if (user) {
          throw new Error('Already Signed up (phoneNumber)');
        }

        const pwd: string = await bcrypt.hash(password, 10);
        user = await ctx.prisma.user.create({
          data: {
            email: email,
            password: pwd,
            phoneNumber: phoneNumber,
            name: name,
            birth: birth,
            gender: gender,
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
