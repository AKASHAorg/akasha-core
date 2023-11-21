// @ts-check

/** @type {import('graphql-config').IGraphQLConfig } */
const config = {
  projects: {
    default: {
      schema: '../tools/composedb/lib/supergraph.graphql', //can be also an url
      documents: ['src/**/*.graphql'],
      extensions: {
        codegen: {
          emitLegacyCommonJSImports: false,
          generates: {
            '../typings/src/sdk/graphql-types-new.ts': {
                plugins: ['typescript'],
                config: {
                    federation: true,
                    skipTypename: true
                  }
                ,
              },
            '../typings/src/sdk/graphql-operation-types-new.ts': {
                preset: 'import-types-preset',
                presetConfig: {
                    typesPath: './graphql-types-new',
                  },
                plugins: ['typescript-operations'],
                config: {
                    federation: true,
                    skipTypename: true,
                    useTypeImports: true
                  },
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
            '../ui/hooks/src/generated/apollo.ts': {
              preset: 'import-types-preset',
              presetConfig: {
                typesPath: '@akashaorg/typings/lib/sdk/graphql-operation-types-new',
              },
              plugins: [
                'typescript-react-apollo'
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
              },
            },
            '../typings/src/sdk/graphql-resolver-types-new.ts': {
                preset: 'import-types-preset',
                presetConfig: {
                    typesPath: './graphql-types-new',
                  },
                plugins: ['typescript-resolvers'],
                config: {
                    federation: true,
                    skipTypename: true,
                    useTypeImports: true
                  }
                ,
              }
            ,
          }
        }
      },
    },
    client_composedb: {
        schema: '../tools/composedb/lib/supergraph.graphql',
        documents: ['src/**/*-*-composedb.graphql'],
        extensions: {
          emitLegacyCommonJSImports: false,
          codegen: {
            generates: {
                '../ui/hooks/src/generated/composedb.ts': {
                    preset: 'import-types-preset',
                    presetConfig: {
                        typesPath: '@akashaorg/typings/lib/sdk/graphql-operation-types-new',

                      },
                    plugins: [{
                        add: {
                          content:
                            `
import getSDK from '@akashaorg/awf-sdk';

function composeDbFetch<TData, TVariables extends Record<string, unknown>>(query: string, variables?: TVariables, options?: unknown) {
  const sdk = getSDK();
  const gqlOptions = Object.assign({}, { context: { source: sdk.services.gql.contextSources.composeDB }}, options);
  return async () => {
    return sdk.services.gql.requester<TData, TVariables>(query, variables, gqlOptions);
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
                        fetcher:
                          {
                            func: 'composeDbFetch',
                            isReactHook: false,
                          }
                      },
                  },
              }
          }
        }
      },
    mutations_client_api: {
      schema: '../tools/composedb/lib/supergraph.graphql',
      documents: ['src/**/*-mutations-api.graphql'],
      extensions: {
        emitLegacyCommonJSImports: false,
        codegen: {
          generates: {
            '../ui/hooks/src/generated/mutations.ts': {
              preset: 'import-types-preset',
              presetConfig: {
                typesPath: '@akashaorg/typings/lib/sdk/graphql-operation-types-new',
              },
              plugins: [{
                add: {
                  content:
                    `
import getSDK from '@akashaorg/awf-sdk';

function composeDbFetch<TData, TVariables extends Record<string, unknown>>(query: string, variables?: TVariables, options?: unknown) {
  const sdk = getSDK();
    const gqlOptions = Object.assign({}, { context: { source: sdk.services.gql.contextSources.default }}, options);
  return async () => {
    return sdk.services.gql.requester<TData, TVariables>(query, variables, gqlOptions);
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
                fetcher:
                  {
                    func: 'composeDbFetch',
                    isReactHook: false,
                  }
              },
            },
          }
        }
      }
    },
    queries_client: {
      schema: '../tools/composedb/lib/supergraph.graphql',
      documents: ['src/**/*-queries.graphql'],
      extensions: {
        emitLegacyCommonJSImports: false,
        codegen: {
          generates: {
            '../ui/hooks/src/generated/queries.ts': {
              preset: 'import-types-preset',
              presetConfig: {
                typesPath: '@akashaorg/typings/lib/sdk/graphql-operation-types-new',
              },
              plugins: [{
                add: {
                  content:
                    `
import getSDK from '@akashaorg/awf-sdk';

function composeDbFetch<TData, TVariables extends Record<string, unknown>>(query: string, variables?: TVariables, options?: unknown) {
  const sdk = getSDK();
  return async () => {
    return sdk.services.gql.requester<TData, TVariables>(query, variables, options);
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
                fetcher:
                  {
                    func: 'composeDbFetch',
                    isReactHook: false,
                  }
              },
            },
          }
        }
      }
    }
  }
};

module.exports = config;
