import { IAkashaError } from '@akashaproject/ui-awf-typings';
import getSDK from '@akashaproject/awf-sdk';
import * as React from 'react';
import { createErrorHandler } from './utils/error-handler';

export enum BookmarkTypes {
  POST = 0,
  COMMENT,
}

const BOOKMARKED_ENTRIES_KEY = 'AKASHA_APP_BOOKMARK_ENTRIES';
const entriesBookmarks = 'entries-bookmarks';

export interface UseEntryBookmarkProps {
  bmKey?: string;
  onError: (err: IAkashaError) => void;
}

export interface IBookmarkActions {
  /**
   *  fetch bookmarks for current logged user
   */
  getBookmarks: () => void;
  /**
   *  bookmark a post
   */
  bookmarkPost: (entryId: string) => void;
  /**
   *  bookmark a comment
   */
  bookmarkComment: (entryId: string) => void;
  /**
   *  remove a bookmark
   */
  removeBookmark: (entryId: string) => void;
}

export interface IBookmarkState {
  bookmarks: { entryId: string; type: BookmarkTypes }[];
  isFetching: boolean;
  bookmarkPostQuery: string | number | null;
  bookmarkCommentQuery: string | number | null;
  removeBookmarkQuery: string | number | null;
}

const initialBookmarkState: IBookmarkState = {
  bookmarks: [],
  isFetching: false,
  bookmarkPostQuery: null,
  bookmarkCommentQuery: null,
  removeBookmarkQuery: null,
};

export type IBookmarkAction =
  | { type: 'GET_BOOKMARKS' }
  | {
      type: 'GET_BOOKMARKS_SUCCESS';
      payload: any;
    }
  | { type: 'BOOKMARK_POST'; payload: string | number }
  | {
      type: 'BOOKMARK_POST_SUCCESS';
      payload: { entryId: string; type: BookmarkTypes }[];
    }
  | { type: 'BOOKMARK_COMMENT'; payload: string | number }
  | {
      type: 'BOOKMARK_COMMENT_SUCCESS';
      payload: { entryId: string; type: BookmarkTypes }[];
    }
  | { type: 'REMOVE_BOOKMARK'; payload: string | number }
  | {
      type: 'REMOVE_BOOKMARK_SUCCESS';
      payload: { entryId: string; type: BookmarkTypes }[];
    };

const bookmarkStateReducer = (state: IBookmarkState, action: IBookmarkAction) => {
  switch (action.type) {
    case 'GET_BOOKMARKS':
      return { ...state, isFetching: true };
    case 'GET_BOOKMARKS_SUCCESS': {
      const data = action.payload;
      if (!data) {
        return {
          ...state,
          isFetching: false,
          bookmarks: [],
        };
      }
      if (data && data.options) {
        const bookmarkedEntries = data.options.findIndex(
          (e: string[]) => e[0] === entriesBookmarks,
        );
        if (bookmarkedEntries !== -1) {
          return {
            ...state,
            isFetching: false,
            bookmarks: JSON.parse(data.options[bookmarkedEntries][1]),
          };
        }
      }
      return { ...state };
    }

    case 'BOOKMARK_POST':
      return { ...state, bookmarkPostQuery: action.payload };
    case 'BOOKMARK_POST_SUCCESS':
      return { ...state, bookmarkPostQuery: null, bookmarks: action.payload };

    case 'BOOKMARK_COMMENT':
      return { ...state, bookmarkCommentQuery: action.payload };
    case 'BOOKMARK_COMMENT_SUCCESS':
      return { ...state, bookmarkCommentQuery: null, bookmarks: action.payload };

    case 'REMOVE_BOOKMARK':
      return { ...state, removeBookmarkQuery: action.payload };
    case 'REMOVE_BOOKMARK_SUCCESS':
      return { ...state, removeBookmarkQuery: null, bookmarks: action.payload };

    default:
      throw new Error('[UseBookmarkReducer] action is not defined!');
  }
};

const useEntryBookmark = (props: UseEntryBookmarkProps): [IBookmarkState, IBookmarkActions] => {
  const { bmKey = BOOKMARKED_ENTRIES_KEY, onError } = props;

  const sdk = getSDK();

  const [bookmarkState, dispatch] = React.useReducer(bookmarkStateReducer, initialBookmarkState);

  React.useEffect(() => {
    if (bookmarkState.isFetching) {
      const call = sdk.services.settings.get(bmKey);
      const callSub = call.subscribe({
        next: resp => {
          const { data } = resp;
          dispatch({ type: 'GET_BOOKMARKS_SUCCESS', payload: data });
        },
        error: createErrorHandler('useEntryBookmark.getBookmarks'),
      });
      return () => callSub.unsubscribe();
    }
    return;
  }, [bookmarkState.isFetching]);

  React.useEffect(() => {
    if (bookmarkState.bookmarkPostQuery) {
      const newBmks = bookmarkState.bookmarks.slice();
      newBmks.unshift({ entryId: bookmarkState.bookmarkPostQuery, type: BookmarkTypes.POST });

      const call = sdk.services.settings.set(bmKey, [[entriesBookmarks, JSON.stringify(newBmks)]]);
      const callSub = call.subscribe({
        next: () => {
          dispatch({ type: 'BOOKMARK_POST_SUCCESS', payload: newBmks });
        },
        error: createErrorHandler('useEntryBookmark.addBookmark', false, onError),
      });
      return () => callSub.unsubscribe();
    }
    return;
  }, [bookmarkState.bookmarkPostQuery]);

  React.useEffect(() => {
    if (bookmarkState.bookmarkCommentQuery) {
      const newBmks = bookmarkState.bookmarks.slice();
      newBmks.unshift({ entryId: bookmarkState.bookmarkCommentQuery, type: BookmarkTypes.COMMENT });

      const call = sdk.services.settings.set(bmKey, [[entriesBookmarks, JSON.stringify(newBmks)]]);
      const callSub = call.subscribe({
        next: () => {
          dispatch({ type: 'BOOKMARK_COMMENT_SUCCESS', payload: newBmks });
        },
        error: createErrorHandler('useEntryBookmark.addBookmark', false, onError),
      });
      return () => callSub.unsubscribe();
    }
    return;
  }, [bookmarkState.bookmarkCommentQuery]);

  React.useEffect(() => {
    if (bookmarkState.removeBookmarkQuery) {
      const bookmarks = bookmarkState.bookmarks.slice();
      const bmIndex = bookmarkState.bookmarks.findIndex(
        (bm: { entryId: string; type: BookmarkTypes }) =>
          bm.entryId === bookmarkState.removeBookmarkQuery,
      );
      if (bmIndex >= 0) {
        bookmarks.splice(bmIndex, 1);
      }
      const call = sdk.services.settings.set(bmKey, [
        ['entries-bookmarks', JSON.stringify(bookmarks)],
      ]);
      const callSub = call.subscribe({
        next: () => {
          dispatch({ type: 'REMOVE_BOOKMARK_SUCCESS', payload: bookmarks });
        },
        error: createErrorHandler('useEntryBookmark.removeBookmark', false, onError),
      });
      return () => callSub.unsubscribe();
    }
    return;
  }, [bookmarkState.removeBookmarkQuery]);

  const actions: IBookmarkActions = {
    getBookmarks() {
      dispatch({ type: 'GET_BOOKMARKS' });
    },
    bookmarkPost(entryId) {
      dispatch({ type: 'BOOKMARK_POST', payload: entryId });
    },
    bookmarkComment(commentId) {
      dispatch({ type: 'BOOKMARK_COMMENT', payload: commentId });
    },
    removeBookmark(entryId) {
      dispatch({ type: 'REMOVE_BOOKMARK', payload: entryId });
    },
  };

  return [bookmarkState, actions];
};

export default useEntryBookmark;
