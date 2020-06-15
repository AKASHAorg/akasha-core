import { action, createComponentStore, Action, thunk, Thunk } from 'easy-peasy';
import { fetchFeedItems, fetchFeedItemData, IFeedItem } from '../services/feed-service';
import { forkJoin } from 'rxjs';
import { getEthAddress } from '../services/profile-service';

const FEED_FETCH_LIMIT = 5;
const SAVED_ENTRIES_ID = 'SAVED_ENTRIES';

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
  bookmarkEntry: Thunk<FeedStateModel, { entryId: string }>;
  unbookmarkEntry: Thunk<FeedStateModel, { entryId: string }>;
  changeActiveFilters: Thunk<FeedStateModel, FeedState['filters']>;
  resetFeed: Action<FeedStateModel>;
  updateEntryStatus: Action<
    FeedStateModel,
    { entryId: string; status: { viewed?: boolean; fetching?: boolean } }
  >;
  getLoggedEthAddress: Thunk<FeedStateModel>;
  getBookmarkedEntries: Thunk<FeedStateModel, { ethAddress: string }>;
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
  bookmarkEntry: thunk(async (actions, payload, { getState }) => {
    const bmEntries = new Set(getState().data.bookmarkedIds as Set<string>);
    bmEntries.add(payload.entryId);
    actions.updateData({
      bookmarkedIds: bmEntries,
    });
  }),
  unbookmarkEntry: thunk(async (actions, payload, { getState }) => {
    const bmEntries = new Set(getState().data.bookmarkedIds as Set<string>);
    bmEntries.delete(payload.entryId);
    actions.updateData({ bookmarkedIds: bmEntries });
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
  getLoggedEthAddress: thunk(async (actions, _payload, { injections }) => {
    const { channels, logger } = injections;
    const $stash = channels.commons.cache_service.getStash(null);
    try {
      const call = forkJoin({
        stash: $stash,
      });
      return call.subscribe(async (deps: { stash: any }) => {
        try {
          const ethAddress = await getEthAddress(deps.stash);
          actions.updateData({
            loggedEthAddress: ethAddress,
          });
        } catch (err) {
          logger.error(err);
          return;
          // // having the eth address is mandatory in this case
          // actions.createError({
          //   errorKey: 'action.getLoggedEthAddress',
          //   error: err,
          //   critical: true,
          // });
        }
      });
    } catch (ex) {
      logger.error(ex);
      return;
      // actions.createError({
      //   errorKey: 'actions.getLoggedEthAddress',
      //   error: ex,
      //   critical: true,
      // });
    }
  }),
  getBookmarkedEntries: thunk(async (actions, payload, { injections }) => {
    const { ethAddress } = payload;
    const { channels, logger } = injections;
    try {
      const call = channels.db.settings_attachment.get({
        ethAddress,
        id: SAVED_ENTRIES_ID,
      });
      call.subscribe(
        (data: any) => {
          if (data) {
            const savedEntries = JSON.parse(data);
            actions.updateData({ bookmarkedIds: new Set(savedEntries) });
          }
        },
        (err: Error) => {
          logger.error(err);
          actions.createError({
            errorKey: 'action[subscription].getBoxSettings',
            error: err,
            critical: false,
          });
        },
      );
    } catch (ex) {
      logger.error(ex);
      actions.createError({
        errorKey: 'action.getBoxSettings',
        error: ex,
        critical: false,
      });
    }

    return;
  }),
};

export const useFeedState = (channels?: any, logger?: any) =>
  createComponentStore(feedStateModel, {
    name: 'FeedApp-EntryState',
    injections: { channels, logger },
  })();
