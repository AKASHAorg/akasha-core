import { IEntryData } from '@akashaproject/design-system/lib/components/Cards/entry-cards/entry-box';
import * as React from 'react';

interface IFeedState {
  isFeedLoading: boolean;
  feedItems: string[];
  feedItemData: {
    [key: string]: any;
  };
  startId?: string;
}
export type IFeedAction =
  | { type: 'LOAD_FEED_START'; payload: { isFeedLoading: boolean } }
  | { type: 'SET_FEED_ITEMS'; payload: { items: any[]; reverse?: boolean; start?: string } }
  | { type: 'SET_FEED_ITEM_DATA'; payload: IEntryData };

interface SetFeedItemsPayload {
  items: { entryId: string }[];
  reverse?: boolean;
  start?: string;
}

const initialFeedState: IFeedState = {
  isFeedLoading: false,
  feedItems: [],
  feedItemData: {},
};

const feedStateReducer = (state: IFeedState, action: IFeedAction) => {
  switch (action.type) {
    case 'LOAD_FEED_START':
      return { ...state, isFeedLoading: true };
    case 'SET_FEED_ITEMS':
      const { reverse, items, start } = action.payload;
      if (reverse) {
        const feedItems = state.feedItems.slice();
        feedItems.unshift(...items);
        return {
          ...state,
          feedItems: feedItems,
          isFeedLoading: false,
          startId: start,
        };
      }
      return {
        ...state,
        feedItems: state.feedItems.concat(action.payload.items),
        isFeedLoading: false,
        startId: start,
      };
    case 'SET_FEED_ITEM_DATA':
      return {
        ...state,
        feedItemData: { ...state.feedItemData, [action.payload.entryId]: action.payload },
      };
  }
};

export interface IFeedActions {
  setFeedItems: (payload: SetFeedItemsPayload) => void;
  setFeedItemData: (itemData: IEntryData) => void;
  loadFeedStart: () => void;
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
        },
      });
    },
    setFeedItemData: itemData => {
      dispatch({ type: 'SET_FEED_ITEM_DATA', payload: itemData });
    },
    loadFeedStart: () => {
      dispatch({ type: 'LOAD_FEED_START', payload: { isFeedLoading: true } });
    },
  };
  return [feedState, stateActions];
};

export default useFeedReducer;
