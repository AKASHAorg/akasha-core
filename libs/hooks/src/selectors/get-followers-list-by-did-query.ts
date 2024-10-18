import { GetFollowersListByDidQuery } from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';
import { isNodeWithIsViewer } from './selector-utils';

export const selectFollowers = (data: GetFollowersListByDidQuery) => {
  if (isNodeWithIsViewer(data)) {
    return data.node.akashaProfile?.followers?.edges.map(edge => edge?.node) ?? [];
  }
};

export const selectPageInfo = (data: GetFollowersListByDidQuery) => {
  if (isNodeWithIsViewer(data)) {
    return data.node.akashaProfile?.followers?.pageInfo;
  }
};
