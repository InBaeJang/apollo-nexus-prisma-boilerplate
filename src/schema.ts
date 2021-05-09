import { makeSchema } from 'nexus'
import * as allTypes from './graphql';

export const schema = makeSchema({
    types: allTypes,
    outputs: {
        schema: __dirname + '/generated/schema.graphql',
        typegen: __dirname + '/generated/nexus.ts',
    },
    contextType: {
        module: require.resolve('./context'),
        export: 'Context',
    },
    sourceTypes: {
        modules: [{
            module: '@prisma/client',
            alias: 'prisma',
        },
        ],
    },
})
