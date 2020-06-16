import { action, createComponentStore, Action, thunk, Thunk } from 'easy-peasy';
import { fetchFeedItems, fetchFeedItemData, IFeedItem } from '../services/feed-service';

const FEED_FETCH_LIMIT = 5;

export interface IStateErrorPayload {
  errorKey: string;
  error: Error;
  critical: boolean;
}

export interface IEntryData {
  entryId: string;
}

export interface FeedState {
  loggedEthAddress: string | null;
  /**
   * an ordered list with entryIds fetched
   * the order in this list is the order we display in feed
   */
  entryIds: string[];
  bookmarkedIds: Set<string>;
  /**
   * a map with all entries data
   * {
   *   [key: EntryId]: EntryData;
   * }
   */
  entriesData: { [key: string]: IEntryData };
  entryStatus: {
    [key: string]: {
      /**
       * when an entry was viewed by the user
       */
      viewed?: boolean;
      /**
       * when a request was made and waiting for response
       */
      fetching?: boolean;
    };
  };
  filters: {
    filter: 'all' | 'top_reposted' | 'top_commented';
    sort: 'latest' | 'oldest';
  };
  /**
   * whether we are fetching entries or not
   */
  fetching: boolean;
  hasMoreItems: boolean;
  errors: {
    // key is the context of the error
    // example {'form.username': new Error('username is taken')}
    [key: string]: {
      error: Error;
      critical: boolean;
    };
  };
}
export interface IGetFeedOptions {
  options: {
    start?: string;
    limit: number;
    reverse?: boolean;
  };
  filters: FeedState['filters'];
}
export interface IAddFeedItemsPayload {
  feedItems: IFeedItem[];
  reverse?: boolean;
  hasMoreItems: boolean;
}
export interface FeedStateModel {
  data: FeedState;
  updateData: Action<FeedStateModel, Partial<FeedState>>;
  updateEntryData: Action<FeedStateModel, IFeedItem | null>;
  createError: Action<FeedStateModel, IStateErrorPayload>;
  addFeedItems: Action<FeedStateModel, IAddFeedItemsPayload>;
  getFeedItems: Thunk<FeedStateModel, IGetFeedOptions>;
  getItemData: Thunk<FeedStateModel, { entryId: string }>;
  changeActiveFilters: Thunk<FeedStateModel, FeedState['filters']>;
  resetFeed: Action<FeedStateModel>;
  updateEntryStatus: Action<
    FeedStateModel,
    { entryId: string; status: { viewed?: boolean; fetching?: boolean } }
  >;
}

export const feedStateModel: FeedStateModel = {
  data: {
    loggedEthAddress: null,
    entryIds: [],
    bookmarkedIds: new Set(),
    entriesData: {},
    entryStatus: {},
    filters: {
      filter: 'all',
      sort: 'latest',
    },
    fetching: false,
    hasMoreItems: true,
    errors: {},
  },
  updateData: action((state, payload) => {
    state.data = Object.assign({}, state.data, payload);
  }),
  updateEntryData: action((state, payload) => {
    if (payload) {
      state.data.entriesData[payload.entryId] = payload;
    }
  }),
  updateEntryStatus: action((state, payload) => {
    state.data.entryStatus[payload.entryId] = payload.status;
  }),
  addFeedItems: action((state, payload) => {
    const { feedItems, reverse, hasMoreItems } = payload;
    if (reverse) {
      payload.feedItems.forEach(item => {
        state.data.entryIds = [item.entryId, ...state.data.entryIds];
        state.data.entryStatus[item.entryId] = {
          fetching: false,
          viewed: false,
        };
      });
    } else {
      state.data.entryIds = state.data.entryIds.concat(feedItems.map(item => item.entryId));
      state.data.entryStatus = Object.assign(
        {},
        state.data.entryStatus,
        feedItems.reduce(
          (prev, curr) => ({ ...prev, [curr.entryId]: { viewed: false, fetching: false } }),
          {},
        ),
      );
    }
    state.data.hasMoreItems = hasMoreItems;
  }),
  // add errors to store, merging them with old ones
  createError: action((state, payload) => {
    state.data = Object.assign({}, state.data, {
      errors: {
        ...state.data.errors,
        [payload.errorKey]: {
          error: payload.error,
          critical: payload.critical,
        },
      },
    });
  }),
  getFeedItems: thunk(async (actions, payload, _injections) => {
    const { options, filters } = payload;
    const { limit = FEED_FETCH_LIMIT } = options;
    let hasMoreItems = true;
    actions.updateData({
      fetching: true,
    });
    const resp = await fetchFeedItems({ ...options, limit: limit + 3 }, filters);
    if (resp.items.length < limit + 3) {
      hasMoreItems = false;
    }
    actions.addFeedItems({ hasMoreItems, feedItems: resp.items, reverse: options.reverse });
    actions.updateData({
      fetching: false,
    });
  }),
  getItemData: thunk(async (actions, payload, _injections) => {
    const { entryId } = payload;
    actions.updateEntryStatus({
      entryId,
      status: {
        fetching: true,
        viewed: false,
      },
    });
    const resp = await fetchFeedItemData({ entryId });
    actions.updateEntryData(resp);
    actions.updateEntryStatus({
      entryId,
      status: {
        fetching: false,
      },
    });
  }),
  changeActiveFilters: thunk(async (actions, payload) => {
    actions.updateData({
      filters: payload,
    });
  }),
  resetFeed: action(state => {
    state.data = {
      ...state.data,
      entryIds: [],
      entriesData: {},
    };
  }),
};

export const useFeedState = (channels?: any, logger?: any) =>
  createComponentStore(feedStateModel, {
    name: 'FeedApp-EntryState',
    injections: { channels, logger },
  })();
