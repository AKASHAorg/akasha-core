import { action, createComponentStore, Action, thunk, Thunk, persist } from 'easy-peasy';
import { fetchFeedItems, fetchFeedItemData, IFeedItem } from '../services/feed-service';
import { delay } from '../services/dummy-data';

const FEED_FETCH_LIMIT = 5;

export interface IStateErrorPayload {
  errorKey: string;
  error: Error;
  critical: boolean;
}
// when a new entry data is received, we may want to show some info about the author
// or about the entry. All are optional except entryId
export interface INewEntryInfo {
  entryId: string;
  // already resolved infos about the author
  author?: { name?: string; avatar: string };
  publishDate?: Date;
}

export interface IEntryData extends IFeedItem {
  status: {
    /**
     * when an entry was viewed by the user
     */
    viewed?: boolean;
    /**
     * when a request was made and waiting for response
     */
    fetching?: boolean;
    errors?: {
      [type: string]: {
        error: Error;
        critical: boolean;
      };
    };
  };
}

export interface FeedState {
  /**
   * an ordered list with entryIds fetched
   * the order in this list is the order we display in feed
   */
  entryIds: string[];
  feedViewState: {
    startId?: string;
    newerEntries: INewEntryInfo[];
  };
  /**
   * a map with all entries data
   * {
   *   [key: EntryId]: EntryData;
   * }
   */
  entriesData: { [key: string]: IEntryData };
  filters: {
    filter: 'all' | 'top_reposted' | 'top_commented';
    sort: 'latest' | 'oldest';
  };
  /**
   * whether we are fetching entries or not
   */
  fetching: boolean;
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
}
export interface IUpdateEntryStatusPayload {
  entryId: string;
  status: {
    viewed?: boolean;
    fetching?: boolean;
    errors?: {
      [type: string]: {
        error: Error;
        critical: boolean;
      };
    };
  };
}
export interface IEntryErrorPayload {
  entryId: string;
  errorObj: {
    key: string;
    details: {
      critical: boolean;
      error: Error;
    };
  };
}

export interface FeedStateModel {
  data: FeedState;
  updateData: Action<FeedStateModel, Partial<FeedState>>;
  updateEntryData: Action<FeedStateModel, { entryData: IFeedItem; status: IEntryData['status'] }>;
  createError: Action<FeedStateModel, IStateErrorPayload>;
  addFeedItems: Action<FeedStateModel, IAddFeedItemsPayload>;
  getFeedItems: Thunk<FeedStateModel, IGetFeedOptions>;
  getItemData: Thunk<FeedStateModel, { entryId: string }>;
  changeActiveFilters: Thunk<FeedStateModel, FeedState['filters']>;
  resetFeed: Action<FeedStateModel>;
  getFeedViewState: Thunk<FeedStateModel, { ethAddress: string }>;
  checkForNewEntries: Thunk<FeedStateModel, { startId?: string }>;
  markAsRead: Thunk<FeedStateModel, { itemId: string; ethAddress: string }>;
  loadNewerEntries: Thunk<FeedStateModel, { newerEntries: INewEntryInfo[] }>;
}

export const feedStateModel: FeedStateModel = {
  data: {
    entryIds: [],
    feedViewState: persist({
      startId: undefined,
      newerEntries: [],
    }),
    entriesData: {},
    filters: {
      filter: 'all',
      sort: 'latest',
    },
    fetching: false,
    errors: {},
  },

  updateData: action((state, payload) => {
    state.data = Object.assign({}, state.data, payload);
  }),

  updateEntryData: action((state, payload) => {
    if (payload) {
      state.data.entriesData[payload.entryData.entryId] = {
        ...payload.entryData,
        status: payload.status,
      };
    }
  }),

  addFeedItems: action((state, payload) => {
    const { feedItems, reverse } = payload;
    if (reverse) {
      payload.feedItems.forEach(item => {
        state.data.entryIds = [item.entryId, ...state.data.entryIds];
        state.data.entriesData[item.entryId] = {
          entryId: item.entryId,
          status: {
            fetching: false,
          },
        };
      });
    } else {
      state.data.entryIds = state.data.entryIds.concat(feedItems.map(item => item.entryId));
      feedItems.forEach(item => {
        state.data.entriesData[item.entryId] = {
          entryId: item.entryId,
          status: {
            fetching: false,
          },
        };
      });
    }
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

  getFeedViewState: thunk(async (actions, _payload) => {
    // get feed view state from db
    actions.updateData({});
  }),

  checkForNewEntries: thunk(async (actions, payload) => {
    delay(10000).then(() => {
      actions.updateData({
        feedViewState: {
          startId: payload.startId,
          newerEntries: [{ entryId: '0x112233' }],
        },
      });
    });
  }),

  getFeedItems: thunk(async (actions, payload, { injections }) => {
    const { logger } = injections;
    const { options, filters } = payload;
    const { limit = FEED_FETCH_LIMIT } = options;
    actions.updateData({
      fetching: true,
    });
    try {
      const resp = await fetchFeedItems({ ...options, limit: limit + 3 }, filters);
      actions.addFeedItems({ feedItems: resp.items, reverse: options.reverse });
      actions.updateData({
        fetching: false,
      });
    } catch (ex) {
      logger.error('Error in feed-state.ts/getFeedItems: %j', ex);
      actions.createError({
        errorKey: 'actions_getFeedItems',
        error: ex,
        critical: true,
      });
    }
  }),

  getItemData: thunk(async (actions, payload, { injections }) => {
    const { logger } = injections;
    const { entryId } = payload;
    actions.updateEntryData({
      entryData: {
        entryId,
      },
      status: {
        fetching: true,
        viewed: false,
      },
    });
    try {
      const resp = await fetchFeedItemData({ entryId });
      actions.updateEntryData({
        entryData: resp,
        status: {
          fetching: false,
        },
      });
    } catch (ex) {
      logger.error('Error in feed-state.ts/getItemData: %j', ex);
      actions.updateEntryData({
        entryData: { entryId },
        status: {
          fetching: false,
          errors: {
            [`action_getItemData`]: {
              critical: true,
              error: ex,
            },
          },
        },
      });
    }
  }),

  loadNewerEntries: thunk(async (actions, payload) => {
    const { newerEntries } = payload;
    actions.addFeedItems({
      feedItems: newerEntries.map(entry => ({ entryId: entry.entryId })),
      reverse: true,
    });
    actions.updateData({
      feedViewState: {
        startId: newerEntries[0].entryId,
        newerEntries: [],
      },
    });
  }),

  markAsRead: thunk(async (actions, payload, { getState }) => {
    const { itemId } = payload;
    actions.updateData({
      feedViewState: {
        startId: itemId,
        newerEntries: getState().data.feedViewState.newerEntries,
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
