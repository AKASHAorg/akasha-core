// @ts-check

/** @type {import("@graphql-codegen/cli").CodegenConfig} */
const config = {
    schema: '../api/hub/src/schema.ts', //can be also an url
    documents: ['src/**/*.graphql', '!src/**/*-new.graphql'],
    generates: {
      '../typings/src/sdk/graphql-types.ts': {
        plugins: ['typescript'],
        config: { federation: true, skipTypename: true },
      },
      '../typings/src/sdk/graphql-operation-types.ts': {
        preset: 'import-types-preset',
        presetConfig: {
          typesPath: './graphql-types',
        },
        plugins: ['typescript-operations'],
        config: { federation: true, skipTypename: true },
      },
      './src/gql/api.ts': {
        preset: 'import-types-preset',
        presetConfig: {
          typesPath: '@akashaorg/typings/sdk/graphql-operation-types',
        },
        plugins: ['typescript-graphql-request'],
        config: { federation: true, skipTypename: true },
      },
      '../typings/src/sdk/graphql-resolver-types.ts': {
        preset: 'import-types-preset',
        presetConfig: {
          typesPath: './graphql-types',
        },
        plugins: ['typescript-resolvers'],
        config: { federation: true, skipTypename: true },
      },
    },
};

module.exports = config;
