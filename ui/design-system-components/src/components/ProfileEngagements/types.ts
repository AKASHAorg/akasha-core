import { FollowList, type Image } from '@akashaorg/typings/lib/ui';
import { ReactElement } from 'react';

export const LOADING_LIST_SIZE = 5;

export const ENTRY_HEIGHT = 72;

export type EngagementProps = {
  authenticatedDID: string;
  profileAnchorLink: string;
  followList: FollowList;
  onLoadMore: () => Promise<unknown>;
  transformSource: (src: Image) => Image;
  renderFollowElement: (
    profileId: string,
    followId: string,
    isFollowing: boolean,
  ) => ReactElement | null;
  onProfileClick: (profileId: string) => void;
};
