import { Follow } from '@akashaorg/typings/sdk/graphql-types-new';
import { Profile } from '@akashaorg/typings/ui';
import { ReactElement } from 'react';

export const LOADING_LIST_SIZE = 10;

export type Engagement = {
  status: 'loading' | 'error' | 'success';
  data: { id: Follow['id']; isFollowing: Follow['isFollowing']; profile?: Profile }[];
};

export type EngagementProps = {
  engagement: Engagement;
  profileAnchorLink: string;
  loadingMoreLabel: string;
  renderFollowElement: (streamId: string, isFollowing: boolean) => ReactElement;
  onError: () => void;
  onProfileClick: (profileId: string) => void;
};
