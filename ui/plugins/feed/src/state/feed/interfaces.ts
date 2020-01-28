import { IEntryData } from '@akashaproject/design-system/lib/components/Cards/entry-cards/entry-box';

export type activeProfilesFilterType = 'followers' | 'following';
export type activeAppsFilterType = 'installed' | 'available';

export interface IFeedItem {
  id: string;
}

/**
 * a feed
 * a list that contains only a reference to a feed item and author
 */
export interface IFeed {
  profileId: string;
  items: IFeedItem[];
}

export interface IFeedItemData {
  [k: string]: IEntryData;
}

export interface IFeedItem {
  entryId: string;
}

/**
 * a feed item is an actual entry
 */

export interface IFeedState {
  items: IFeedItem[];
  itemData: IFeedItemData;
}

export type IReducer<S, A> = (action: A, state: S) => S;

/* Action Payloads */
