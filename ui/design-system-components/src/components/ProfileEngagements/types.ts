import { AkashaProfileImageVersions } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { FollowList } from '@akashaorg/typings/lib/ui';
import { ReactElement } from 'react';

export const LOADING_LIST_SIZE = 10;

export type EngagementProps = {
  authenticatedDID: string;
  profileAnchorLink: string;
  loadMore: boolean;
  followList: FollowList;
  onLoadMore: () => void;
  getMediaUrl: (image?: AkashaProfileImageVersions) => AkashaProfileImageVersions;
  renderFollowElement: (
    profileId: string,
    followId: string,
    isFollowing: boolean,
  ) => ReactElement | null;
  onProfileClick: (profileId: string) => void;
};
