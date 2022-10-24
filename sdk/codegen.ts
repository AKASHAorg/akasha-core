import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: '../api/hub/lib/schema.js', //can be also an url
  documents: ['src/**/*.graphql'],
  generates: {
    './src/gql/api.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-graphql-request'],
      federation: true,
    },
  },
};

export default config;
