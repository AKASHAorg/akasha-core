import { AkashaFollow, AkashaProfileImageVersions } from '@akashaorg/typings/sdk/graphql-types-new';
import { Profile } from '@akashaorg/typings/ui';
import { ReactElement } from 'react';

export const LOADING_LIST_SIZE = 10;

export type Engagement = {
  id: AkashaFollow['id'];
  isFollowing: AkashaFollow['isFollowing'];
  profile?: Profile;
}[];

export type EngagementProps = {
  profileAnchorLink: string;
  loadMore: boolean;
  onLoadMore: () => void;
  getMediaUrl: (image?: AkashaProfileImageVersions) => AkashaProfileImageVersions;
  renderFollowElement: (
    profileStreamId: string,
    followStreamId: string,
    isFollowing: boolean,
  ) => ReactElement | null;
  onProfileClick: (profileId: string) => void;
};
