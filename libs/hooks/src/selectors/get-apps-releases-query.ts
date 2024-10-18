import { GetAppsReleasesQuery } from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';

export const selectAppsReleases = (respData: GetAppsReleasesQuery) => {
  return respData?.akashaAppReleaseIndex?.edges;
};

export const selectAppsReleasesPageInfo = (respData: GetAppsReleasesQuery) => {
  return respData?.akashaAppReleaseIndex?.pageInfo;
};
