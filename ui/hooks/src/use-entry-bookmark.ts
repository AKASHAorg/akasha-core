import { IAkashaError } from '@akashaproject/ui-awf-typings';
import * as React from 'react';
import { Subscription } from 'rxjs';
import { createErrorHandler } from './utils/error-handler';

export enum BookmarkTypes {
  POST = 0,
  COMMENT,
}

const BOOKMARKED_ENTRIES_KEY = 'AKASHA_APP_BOOKMARK_ENTRIES';
const entriesBookmarks = 'entries-bookmarks';

export interface UseEntryBookmarkProps {
  ethAddress: string | null;
  bmKey?: string;
  dbService: { [key: string]: any };
  onError: (err: IAkashaError) => void;
}

export interface IBookmarkState {
  bookmarks: { entryId: string; type: BookmarkTypes }[];
  isFetching: boolean;
}
export interface IBookmarkActions {
  bookmarkPost: (entryId: string) => void;
  bookmarkComment: (entryId: string) => void;
  removeBookmark: (entryId: string) => void;
}

const useEntryBookmark = (props: UseEntryBookmarkProps): [IBookmarkState, IBookmarkActions] => {
  const { ethAddress, dbService, bmKey = BOOKMARKED_ENTRIES_KEY, onError } = props;
  const [bookmarkState, setBookmarkState] = React.useState<IBookmarkState>({
    bookmarks: [],
    isFetching: true,
  });

  React.useEffect(() => {
    let subs: Subscription | undefined;
    if (ethAddress) {
      const call = dbService.settingsAttachment.get({
        moduleName: bmKey,
      });
      subs = call.subscribe((resp: any) => {
        const { data } = resp;
        if (!data) {
          return setBookmarkState({
            bookmarks: [],
            isFetching: false,
          });
        }
        if (data && data.services) {
          const bookmarkedEntries = data.services.findIndex(
            (e: string[]) => e[0] === entriesBookmarks,
          );
          if (bookmarkedEntries !== -1) {
            setBookmarkState({
              bookmarks: JSON.parse(data.services[bookmarkedEntries][1]),
              isFetching: false,
            });
          }
        }
      }, createErrorHandler('useEntryBookmark.useEffect', false, onError));
    }

    return () => {
      if (subs) {
        subs.unsubscribe();
      }
    };
  }, [ethAddress]);

  const actions: IBookmarkActions = {
    bookmarkPost(entryId) {
      const newBmks = bookmarkState.bookmarks.slice();
      newBmks.unshift({ entryId, type: BookmarkTypes.POST });

      const call = dbService.settingsAttachment.put({
        moduleName: bmKey,
        services: [[entriesBookmarks, JSON.stringify(newBmks)]],
      });
      call.subscribe(async (_resp: any) => {
        setBookmarkState(prev => ({ ...prev, bookmarks: newBmks }));
      }, createErrorHandler('useEntryBookmark.addBookmark', false, onError));
    },
    bookmarkComment(commentId) {
      const newBmks = bookmarkState.bookmarks.slice();
      newBmks.unshift({ entryId: commentId, type: BookmarkTypes.COMMENT });
      const call = dbService.settingsAttachment.put({
        moduleName: bmKey,
        services: [[entriesBookmarks, JSON.stringify(newBmks)]],
      });
      call.subscribe(async (_resp: any) => {
        setBookmarkState(prev => ({ ...prev, bookmarks: newBmks }));
      }, createErrorHandler('useEntryBookmark.addBookmark', false, onError));
    },
    removeBookmark(entryId) {
      const bookmarks = bookmarkState.bookmarks.slice();
      const bmIndex = bookmarkState.bookmarks.findIndex(bm => bm.entryId === entryId);
      if (bmIndex >= 0) {
        bookmarks.splice(bmIndex, 1);
      }
      const call = dbService.settingsAttachment.put({
        moduleName: bmKey,
        services: [['entries-bookmarks', JSON.stringify(bookmarks)]],
      });
      call.subscribe(async (_resp: any) => {
        setBookmarkState(prev => ({ ...prev, bookmarks }));
      }, createErrorHandler('useEntryBookmark.removeBookmark', false, onError));
    },
  };

  return [bookmarkState, actions];
};

export default useEntryBookmark;
