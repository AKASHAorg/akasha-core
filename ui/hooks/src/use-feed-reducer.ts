import { IEntryData } from '@akashaproject/design-system/lib/components/Cards/entry-cards/entry-box';
import * as React from 'react';

interface IFeedState {
  isFeedLoading: boolean;
  feedItems: string[];
  feedItemData: {
    [key: string]: any;
  };
  hasMoreItems: boolean;
  nextItemId?: string;
  optimisticEntries: IEntryData[];
}
export type IFeedAction =
  | { type: 'LOAD_FEED_START'; payload: { isFeedLoading: boolean } }
  | {
      type: 'SET_FEED_ITEMS';
      payload: { items: any[]; reverse?: boolean; start?: string; nextItemId?: string };
    }
  | { type: 'SET_FEED_ITEM_DATA'; payload: IEntryData }
  | { type: 'HAS_MORE_ITEMS'; payload: { hasMoreItems: boolean } }
  | { type: 'ADD_OPTIMISTIC_ENTRY'; payload: IEntryData }
  | { type: 'UPDATE_OPTIMISTIC_ENTRY'; payload: { entryId: string; data: Partial<IEntryData> } };

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
  /* entries that are published
   * optimistically (aka without waiting for the publishing to complete)
   * they will be prepended to the feed using the customEntities
   */
  optimisticEntries: [],
};

const feedStateReducer = (state: IFeedState, action: IFeedAction) => {
  switch (action.type) {
    case 'LOAD_FEED_START':
      return { ...state, isFeedLoading: true };
    case 'SET_FEED_ITEMS':
      const { reverse, items, nextItemId } = action.payload;
      if (reverse) {
        const feedItems = state.feedItems.slice();
        feedItems.unshift(...items);
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
    case 'ADD_OPTIMISTIC_ENTRY':
      return {
        ...state,
        optimisticEntries: state.optimisticEntries.concat(action.payload),
      };
    case 'UPDATE_OPTIMISTIC_ENTRY':
      const entry = state.optimisticEntries.find(e => e.entryId === action.payload.entryId);
      if (entry) {
        return {
          ...state,
          optimisticEntries: state.optimisticEntries
            .filter(e => e.entryId !== action.payload.entryId)
            .concat({ ...entry, ...action.payload.data }),
        };
      }
      return state;
    default:
      throw new Error('[UseFeedReducer] action is not defined!');
  }
};

export interface IFeedActions {
  setFeedItems: (payload: SetFeedItemsPayload) => void;
  setFeedItemData: (itemData: IEntryData) => void;
  loadFeedStart: () => void;
  hasMoreItems: (data: boolean) => void;
  addOptimisticEntry: (data: IEntryData) => void;
  updateOptimisticEntry: (entryId: string, data: Partial<IEntryData>) => void;
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
    addOptimisticEntry: data => dispatch({ type: 'ADD_OPTIMISTIC_ENTRY', payload: data }),
    updateOptimisticEntry: (entryId, data) =>
      dispatch({ type: 'UPDATE_OPTIMISTIC_ENTRY', payload: { entryId, data } }),
  };
  return [feedState, stateActions];
};

export default useFeedReducer;
