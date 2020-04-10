import { runGQL } from '@akashaproject/sdk-runtime/lib/gql.network.client';

export const getProfile = async (fields: string[], ethAddress: string) => {
  const query = `
  query GetProfile($ethAddress: String!) {
       profile(ethAddress: $ethAddress) {
         ${fields.concat(' ')}
       }
      }`;
  return runGQL({
    query: query,
    variables: { ethAddress: ethAddress },
    operationName: 'GetProfile',
  });
};
