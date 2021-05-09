import { arg, list, nonNull, objectType, stringArg } from 'nexus'

export const Mutation = objectType({
  name: "Mutation",
  definition(t) {
    t.nonNull.list.string("someList", {
      args: {
        items: nonNull(list(stringArg())),
      },
    })
    t.nonNull.field("createPost", {
      type: "Post",
      args: {
        input: arg({ type: nonNull("CreatePostInput") }),
      },
    })
    t.nonNull.field("registerClick", {
      type: "Query",
      args: {
        uuid: arg({ type: "UUID" }),
      },
    })
  }
})