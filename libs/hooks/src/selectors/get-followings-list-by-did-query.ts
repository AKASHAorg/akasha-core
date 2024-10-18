import { GetFollowingListByDidQuery } from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';
import { isNodeWithIsViewer } from './selector-utils';

export const selectFollowings = (data: GetFollowingListByDidQuery) => {
  if (isNodeWithIsViewer(data)) {
    return data.node.akashaFollowList?.edges?.map(edge => edge?.node) ?? [];
  }
};

export const selectPageInfo = (data: GetFollowingListByDidQuery) => {
  if (isNodeWithIsViewer(data)) {
    return data.node.akashaFollowList?.pageInfo;
  }
};
