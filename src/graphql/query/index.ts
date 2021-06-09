import { queryType } from "nexus"
export { Checkup } from './checkup'

export const Query = queryType({
  definition(t) {
    t.string("test", {
      resolve: async (_, { }, ctx) => {

        return 'done'
      }
    })
  }
})