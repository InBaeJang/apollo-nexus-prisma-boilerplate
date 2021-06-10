import { extendType } from 'nexus';
import jwt from 'jsonwebtoken';
import { APP_SECRET } from '../constants';
import { Context } from 'vm';

function getUserId(context: Context) {
  const Authorization: string = context.headers['authorization']
  if (Authorization) {
    const token: string = Authorization.replace('Bearer ', '')
    const userId = (<any>jwt.verify(token, APP_SECRET)).userId
    return userId
  } else {
    throw new Error('No token')
  }
}

export const Checkup = extendType({
  type: 'Query',
  definition(t) {
    t.field('checkup', {
      type: 'User',
      resolve: async (_, { }, ctx) => {
        console.log('checkup START');
        const userId = getUserId(ctx)

        const user = await ctx.prisma.user.findUnique({
          where: { id: userId }
        })
        if (user) {
          console.log('  user login: ' + user.name)
          console.log('checkUp END')
          return user
        } else {
          console.log('  No user')
          console.log('checkUp END')
          throw new Error('No user')
        }
      },
    });
  },
});
