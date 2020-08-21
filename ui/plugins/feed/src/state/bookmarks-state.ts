import { action, createComponentStore, Action, thunk, Thunk } from 'easy-peasy';
import { IFeedItem, fetchFeedItemData } from '../services/feed-service';

const BOOKMARKED_ENTRIES_KEY = 'FEED_APP_BOOKMARK_ENTRIES';

export interface IStateErrorPayload {
  errorKey: string;
  error: Error;
  critical: boolean;
}

export interface IEntryData {
  entryId: string;
}

export interface BookmarksState {
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
export interface IGetBookmarkedItemsOptions {
  ethAddress: string;
  options: {
    start?: string;
    limit: number;
  };
}
export interface IAddFeedItemsPayload {
  feedItems: IFeedItem[];
  reverse?: boolean;
  hasMoreItems: boolean;
}
export interface BookmarksStateModel {
  data: BookmarksState;
  updateData: Action<BookmarksStateModel, Partial<BookmarksState>>;
  updateEntryData: Action<BookmarksStateModel, IFeedItem | null>;
  createError: Action<BookmarksStateModel, IStateErrorPayload>;
  addBookmarkedItems: Action<BookmarksStateModel, IAddFeedItemsPayload>;
  getBookmarkedItems: Thunk<BookmarksStateModel, IGetBookmarkedItemsOptions>;
  getItemData: Thunk<BookmarksStateModel, { entryId: string }>;
  bookmarkEntry: Thunk<BookmarksStateModel, { entryId: string; ethAddress: string }>;
  unbookmarkEntry: Thunk<BookmarksStateModel, { entryId: string; ethAddress: string }>;
  updateEntryStatus: Action<
    BookmarksStateModel,
    { entryId: string; status: { viewed?: boolean; fetching?: boolean } }
  >;
}

export const bookmarksStateModel: BookmarksStateModel = {
  data: {
    bookmarkedIds: new Set(),
    entriesData: {},
    entryStatus: {},
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
  addBookmarkedItems: action((state, payload) => {
    const { feedItems, hasMoreItems } = payload;
    feedItems.forEach(item => {
      state.data.bookmarkedIds = state.data.bookmarkedIds.add(item.entryId);
      state.data.entryStatus[item.entryId] = {
        fetching: false,
        viewed: false,
      };
    });
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
  bookmarkEntry: thunk(async (actions, payload, { getState, injections }) => {
    const { entryId, ethAddress } = payload;
    const { channels /* , logger */ } = injections;

    const bmEntries = new Set(getState().data.bookmarkedIds as Set<string>);
    bmEntries.add(entryId);

    const call = channels.db.settingsAttachment.put({
      ethAddress: ethAddress,
      obj: {
        data: JSON.stringify(Array.from(bmEntries)),
        type: 'string',
        id: BOOKMARKED_ENTRIES_KEY,
      },
    });
    call.subscribe(async (response: any) => {
      const attachment = await response.data.doc.getAttachment(BOOKMARKED_ENTRIES_KEY);
      const textArr = await attachment.getStringData();

      actions.updateData({
        bookmarkedIds: new Set(JSON.parse(textArr)),
      });
    });
  }),
  unbookmarkEntry: thunk(async (actions, payload, { getState, injections }) => {
    const { entryId, ethAddress } = payload;
    const { channels } = injections;

    const bmEntries = new Set(getState().data.bookmarkedIds as Set<string>);
    bmEntries.delete(entryId);

    const call = channels.db.settingsAttachment.put({
      ethAddress: ethAddress,
      obj: {
        // store an array instead of Set. Sets can be tricky to stringify.
        data: JSON.stringify(Array.from(bmEntries)),
        type: 'string',
        id: BOOKMARKED_ENTRIES_KEY,
      },
    });
    call.subscribe(async (response: any) => {
      const attachment = await response.data.doc.getAttachment(BOOKMARKED_ENTRIES_KEY);
      const textArr = await attachment.getStringData();

      actions.updateData({
        bookmarkedIds: new Set(JSON.parse(textArr)),
      });
    });
    actions.updateData({ bookmarkedIds: bmEntries });
  }),

  getBookmarkedItems: thunk(async (actions, payload, { injections }) => {
    const { ethAddress } = payload;
    const { channels, logger } = injections;
    try {
      actions.updateData({ fetching: true });
      const call = channels.db.settingsAttachment.get({
        ethAddress,
        id: BOOKMARKED_ENTRIES_KEY,
      });
      call.subscribe(
        (resp: any) => {
          const { data } = resp;
          if (data) {
            actions.updateData({ bookmarkedIds: new Set(JSON.parse(data)) });
          }
          actions.updateData({ fetching: false });
        },
        (err: Error) => {
          logger.error('Error in getBoxSettings: %d', err.message);
          actions.createError({
            errorKey: 'action[subscription].getBoxSettings',
            error: err,
            critical: false,
          });
        },
      );
    } catch (ex) {
      logger.error('Error in getBoxSettings: %s', ex.message);
      actions.createError({
        errorKey: 'action.getBoxSettings',
        error: ex,
        critical: false,
      });
    }

    return;
  }),
};

export const useBookmarksState = (channels?: any, logger?: any) =>
  createComponentStore(bookmarksStateModel, {
    name: 'FeedApp-BookmarksState',
    injections: { channels, logger },
  })();
