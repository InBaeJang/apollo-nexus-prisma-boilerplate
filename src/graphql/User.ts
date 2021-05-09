import { arg, enumType, objectType, stringArg } from "nexus"

export const User = objectType({
  name: "User",
  definition(t) {
    t.nonNull.id("id")
    t.nonNull.string("name", {
      description: 'This is a description of a name',
      args: {
        prefix: stringArg({ description: "And a description of an arg" }),
      },
    })
    t.nonNull.string("email")
    t.string("phone")
    t.nonNull.list.nonNull.field("posts", {
      type: "Post",
      args: {
        filters: arg({ type: "PostFilters" }),
      },
    })
    t.field("outEnum", { type: "SomeEnum" })
  }
})

export const AuthUser = objectType({
    name: "AuthUser",
    definition(t) {
        t.string("token")
        t.field("user", { type: "User" })
    }
})

export const SomeEnum = enumType({
  name: "SomeEnum",
  members: ['A',{name:'B',deprecation:'This is a deprecation reason for B',value:'B'}],
});