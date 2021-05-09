import { arg, nonNull, queryType, unionType } from "nexus"

export const Query = queryType({
  definition(t) {
    t.nonNull.field("user", { type: "User" })
    t.nonNull.list.nonNull.field("posts", {
      type: "Post",
      args: {
        filters: arg({ type: nonNull("PostFilters") }),
      },
      resolve: async (_, { }, ctx) =>{

      }
    })
  }
})