import { execute, makePromise } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import gql from 'graphql-tag';
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
const stash = new Stash({
  max: 420,
  maxAge: 1000 * 60 * 60, // 1h
});
export const runGQL = async (operation: GqlOperation) => {
  const opHash = hash(operation, { algorithm: 'sha1', unorderedObjects: false });
  if (stash.entries.has(opHash)) {
    return stash.get(opHash);
  }
  const tOperation = makeOperation(operation);
  const data = await makePromise(execute(link, tOperation));
  stash.set(opHash, data);
  return data;
};
