import { FollowList, Image } from '@akashaorg/typings/lib/ui';
import { ReactElement } from 'react';

export const LOADING_LIST_SIZE = 10;

export type EngagementProps = {
  authenticatedDID: string;
  profileAnchorLink: string;
  loadMore: boolean;
  followList: FollowList;
  onLoadMore: () => void;
  transformSource: (src: Image) => Image;
  renderFollowElement: (
    profileId: string,
    followId: string,
    isFollowing: boolean,
  ) => ReactElement | null;
  onProfileClick: (profileId: string) => void;
};
