import { Follow, ProfileImageVersions } from '@akashaorg/typings/sdk/graphql-types-new';
import { Profile } from '@akashaorg/typings/ui';
import { ReactElement } from 'react';

export const LOADING_LIST_SIZE = 10;

export type Engagement = {
  id: Follow['id'];
  isFollowing: Follow['isFollowing'];
  profile?: Profile;
}[];

export type EngagementProps = {
  profileAnchorLink: string;
  loadingMoreLabel: string;
  getMediaUrl: (image?: ProfileImageVersions) => ProfileImageVersions;
  renderFollowElement: (
    profileStreamId: string,
    followStreamId: string,
    isFollowing: boolean,
  ) => ReactElement | null;
  onProfileClick: (profileId: string) => void;
};
