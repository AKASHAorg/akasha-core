import { GetAppsQuery } from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';

export const selectAkashaApp = (respData: GetAppsQuery) => {
  return respData?.akashaAppIndex?.edges[0]?.node;
};
