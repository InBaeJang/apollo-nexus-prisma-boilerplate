import { enumType, objectType } from 'nexus';

export const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('email');
    t.nonNull.string('password');
    t.nonNull.string('phoneNumber');
    t.string('name');
    t.int('birth');
    t.string('gender');
    t.string('status');
  },
});

export const AuthUser = objectType({
  name: 'AuthUser',
  definition(t) {
    t.string('token');
    t.field('user', { type: 'User' });
  },
});
