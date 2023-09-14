// @ts-check

/** @type {import("@graphql-codegen/cli").CodegenConfig} */
const config = {
  schema: '../tools/composedb/lib/schema.graphql', //can be also an url
  documents: ['src/**/*-compose-new.graphql'], // @Todo: replace with src/**/*.graphql
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
    './src/gql/api.ts': {
      preset: 'import-types-preset',
      presetConfig: {
        typesPath: '@akashaorg/typings/lib/sdk/graphql-operation-types-new',
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
    '../typings/src/sdk/graphql-resolver-types-new.ts': {
      preset: 'import-types-preset',
      presetConfig: {
        typesPath: './graphql-types-new',
      },
      plugins: ['typescript-resolvers'],
      config: { federation: true, skipTypename: true, useTypeImports: true },
    },
    '../ui/hooks/src/generated/hooks-new.ts':{
      preset: 'import-types-preset',
      presetConfig: {
        typesPath: '@akashaorg/typings/lib/sdk/graphql-operation-types-new',
        // baseTypesPath: '~@akashaorg/typings/sdk/graphql-operation-types-new',
        // importAllFragmentsFrom: '~@akashaorg/awf-sdk/src/gql/api.new' // does not work with import-preset
      },
      plugins: [
        {
          add: {
            content:
              `
import getSDK from '@akashaorg/awf-sdk';
const sdk = getSDK();
export function fetcher<TData, TVariables extends Record<string, unknown>>(query: string, variables?: TVariables, options?: Record<string, unknown>) {
  return async (): Promise<TData> => {

    const result = await sdk.services.ceramic.getComposeClient().executeQuery(query, variables);
    if (!result.errors || !result.errors.length) {
        // emit eventbus notif
        return result.data as TData;
    }
    throw result.errors;
  };
}
`
          }
        },
        'typescript-react-query'
      ],
      config: {
        federation: true,
        skipTypename: true,
        dedupeOperationSuffix: true,
        dedupeFragments: true,
        pureMagicComment: true,
        useTypeImports: true,
        addInfiniteQuery: true,
        legacyMode: false,
        exposeDocument: true,
        exposeQueryKeys: true,
        exposeMutationKeys: true,
        exposeFetcher: true,
        fetcher: {
          func: 'fetcher'
        }
      },
    },
  },
};

module.exports = config;
