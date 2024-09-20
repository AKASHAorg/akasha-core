import { type Image } from '@akashaorg/typings/lib/ui';
import { ReactElement } from 'react';

export const LOADING_LIST_SIZE = 5;

export const ENTRY_HEIGHT = 72;

export type EngagementProps = {
  authenticatedDID: string;
  showNsfw: boolean;
  profileAnchorLink: string;
  onLoadMore: () => Promise<unknown>;
  transformSource: (src: Image) => Image;
  renderFollowElement: (profileId: string) => ReactElement | null;
  onProfileClick: (profileId: string) => void;
};
