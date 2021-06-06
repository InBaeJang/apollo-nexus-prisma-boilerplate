import { extendType, nonNull, stringArg } from 'nexus';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { APP_SECRET } from '../../constants';

export const Login = extendType({
  type: 'Mutation',
  definition(t) {
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
