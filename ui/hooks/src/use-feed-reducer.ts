import { IEntryData } from '@akashaproject/design-system/lib/components/EntryCard/entry-box';
import * as React from 'react';

interface IFeedState {
  isFeedLoading: boolean;
  feedItems: string[];
  feedItemData: {
    [key: string]: any;
  };
  hasMoreItems: boolean;
  nextItemId?: string;
  pendingEntries: string[];
}
export type IFeedAction =
  | { type: 'LOAD_FEED_START'; payload: { isFeedLoading: boolean } }
  | {
      type: 'SET_FEED_ITEMS';
      payload: { items: any[]; reverse?: boolean; start?: string; nextItemId?: string };
    }
  | { type: 'SET_FEED_ITEM_DATA'; payload: IEntryData }
  | { type: 'HAS_MORE_ITEMS'; payload: { hasMoreItems: boolean } };

interface SetFeedItemsPayload {
  items: { entryId: string }[];
  reverse?: boolean;
  start?: string;
  nextItemId?: string;
}

const initialFeedState: IFeedState = {
  isFeedLoading: false,
  feedItems: [],
  feedItemData: {},
  hasMoreItems: true,
  /* entries that are in a publishing state
   * they will be prepended to the feed using the customEntities
   */
  pendingEntries: [],
};

const feedStateReducer = (state: IFeedState, action: IFeedAction) => {
  switch (action.type) {
    case 'LOAD_FEED_START':
      return { ...state, isFeedLoading: true };
    case 'SET_FEED_ITEMS': {
      const { reverse, items, nextItemId } = action.payload;
      if (reverse) {
        const feedItems = [...items, ...state.feedItems.slice()];
        return {
          ...state,
          nextItemId,
          feedItems: feedItems,
          isFeedLoading: false,
        };
      }
      return {
        ...state,
        nextItemId,
        feedItems: state.feedItems.concat(action.payload.items),
        isFeedLoading: false,
      };
    }
    case 'SET_FEED_ITEM_DATA':
      return {
        ...state,
        feedItemData: { ...state.feedItemData, [action.payload.entryId]: action.payload },
      };
    case 'HAS_MORE_ITEMS':
      return {
        ...state,
        hasMoreItems: action.payload.hasMoreItems,
      };
    default:
      throw new Error('[UseFeedReducer] action is not defined!');
  }
};

export interface IFeedActions {
  setFeedItems: (payload: SetFeedItemsPayload) => void;
  setFeedItemData: (itemData: IEntryData) => void;
  loadFeedStart: () => void;
  hasMoreItems: (data: boolean) => void;
}

const useFeedReducer = (initialState: Partial<IFeedState>): [IFeedState, IFeedActions] => {
  const [feedState, dispatch] = React.useReducer(
    feedStateReducer,
    Object.assign(initialFeedState, initialState),
  );
  const stateActions: IFeedActions = {
    setFeedItems: payload => {
      const { items, reverse, start } = payload;
      dispatch({
        type: 'SET_FEED_ITEMS',
        payload: {
          items: items.map(i => i.entryId),
          reverse: reverse,
          start: start,
          nextItemId: payload.nextItemId,
        },
      });
    },
    setFeedItemData: itemData => {
      dispatch({ type: 'SET_FEED_ITEM_DATA', payload: itemData });
    },
    loadFeedStart: () => {
      dispatch({ type: 'LOAD_FEED_START', payload: { isFeedLoading: true } });
    },
    hasMoreItems: (data: boolean) => {
      dispatch({ type: 'HAS_MORE_ITEMS', payload: { hasMoreItems: data } });
    },
  };
  return [feedState, stateActions];
};

export default useFeedReducer;
