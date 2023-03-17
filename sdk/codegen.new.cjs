// @ts-check

/** @type {import("@graphql-codegen/cli").CodegenConfig} */
const config = {
  schema: 'http://localhost:5005/graphql', //can be also an url
  documents: ['src/**/*-new.graphql'], // @Todo: replace with src/**/*.graphql
  emitLegacyCommonJSImports: false,
  generates: {
    '../typings/src/sdk/graphql-types-new.ts': {
      plugins: ['typescript'],
      config: { federation: true, skipTypename: true },
    },
    '../typings/src/sdk/graphql-operation-types-new.ts': {
      preset: 'import-types-preset',
      presetConfig: {
        typesPath: './graphql-types-new',
      },
      plugins: ['typescript-operations'],
      config: { federation: true, skipTypename: true, useTypeImports: true },
    },
    './src/gql/api.new.ts': {
      preset: 'import-types-preset',
      presetConfig: {
        typesPath: '@akashaorg/typings/sdk/graphql-operation-types-new',
      },
      plugins: ['@graphql-codegen/typescript-generic-sdk'],
      config: {
        federation: true,
        skipTypename: true,
        dedupeOperationSuffix: true,
        dedupeFragments: true,
        pureMagicComment: true,
        useTypeImports: true
      },
    },
    // '../ui/hooks/src/generated/':{
    //   preset: 'client',
    //   presetConfig: {
    //     typesPath: '@akashaorg/typings/sdk/graphql-operation-types',
    //   },
    //   plugins: ['typescript-react-query'],
    //   config: { federation: true, skipTypename: true, dedupeFragments: true, addInfiniteQuery: true },
    // },
    '../typings/src/sdk/graphql-resolver-types-new.ts': {
      preset: 'import-types-preset',
      presetConfig: {
        typesPath: './graphql-types-new',
      },
      plugins: ['typescript-resolvers'],
      config: { federation: true, skipTypename: true, useTypeImports: true },
    },
  },
};

module.exports = config;
