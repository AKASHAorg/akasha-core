import { ApolloLink, HttpLink, gql, toPromise } from '@apollo/client';

import Stash from './Stash';
import hash from 'object-hash';

export interface GqlOperation {
  query: string;
  variables?: object;
  operationName?: string;
  context?: object;
  extensions?: object;
}
export const link = new HttpLink({ uri: process.env.GRAPHQL_URI || '/graphql' });

export const makeOperation = (operation: GqlOperation) => {
  const { query, ...other } = operation;
  return {
    query: gql`
      ${query}
    `,
    ...other,
  };
};
export const gqlStash = new Stash({
  max: 640,
  maxAge: 1000 * 20, // 20s
});
export const runGQL = async (operation: GqlOperation, saveCache: boolean = false) => {
  const opHash = hash(operation, { algorithm: 'sha1', unorderedObjects: false });
  if (gqlStash.entries.has(opHash)) {
    return gqlStash.get(opHash);
  }
  const tOperation = makeOperation(operation);
  const data = await toPromise(ApolloLink.execute(link, tOperation));
  if (saveCache) {
    gqlStash.set(opHash, data);
  }
  return data;
};
