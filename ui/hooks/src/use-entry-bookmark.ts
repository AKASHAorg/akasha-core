import { IAkashaError } from '@akashaproject/ui-awf-typings';
import * as React from 'react';
import { Subscription } from 'rxjs';
import { createErrorHandler } from './utils/error-handler';

export interface UseEntryBookmarkProps {
  ethAddress: string | null;
  bmKey?: string;
  sdkModules: { [key: string]: any };
  logger?: any;
  onError: (err: IAkashaError) => void;
}

export interface IBookmarkActions {
  addBookmark: (entryId: string) => void;
  removeBookmark: (entryId: string) => void;
}

const BOOKMARKED_ENTRIES_KEY = 'FEED_APP_BOOKMARK_ENTRIES';

const entriesBookmarks = 'entries-bookmarks';
const useEntryBookmark = (props: UseEntryBookmarkProps): [Set<string>, IBookmarkActions] => {
  const { ethAddress, sdkModules, bmKey = BOOKMARKED_ENTRIES_KEY, onError, logger } = props;
  const [bookmarks, setBookmarks] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    let subs: Subscription | undefined;
    if (ethAddress) {
      if (sdkModules && sdkModules.hasOwnProperty('db')) {
        const call = sdkModules.db.settingsAttachment.get({
          moduleName: bmKey,
        });
        subs = call.subscribe((resp: any) => {
          const { data } = resp;
          if (data && data.services) {
            const bookmarkedEntries = data.services.findIndex(
              (e: string[]) => e[0] === entriesBookmarks,
            );
            if (bookmarkedEntries !== -1) {
              setBookmarks(new Set(JSON.parse(data.services[bookmarkedEntries][1])));
            }
          }
        }, createErrorHandler('useEntryBookmark.useEffect', false, onError));
      } else {
        if (logger) {
          logger.error('Cannot get bookmarks, DB package not loaded!');
          createErrorHandler(
            'useEntryBookmark.useEffect',
            false,
            onError,
          )(new Error('Cannot get bookmarks, DB package not loaded!'));
        }
      }
    }
    return () => {
      if (subs) {
        subs.unsubscribe();
      }
    };
  }, [ethAddress]);

  const actions: IBookmarkActions = {
    addBookmark: entryId => {
      const newBmks = new Set(bookmarks).add(entryId);
      const call = sdkModules.db.settingsAttachment.put({
        moduleName: bmKey,
        services: [[entriesBookmarks, JSON.stringify(Array.from(newBmks))]],
      });
      call.subscribe(async (_resp: any) => {
        setBookmarks(newBmks);
      }, createErrorHandler('useEntryBookmark.addBookmark', false, onError));
    },
    removeBookmark: entryId => {
      const newBkmks = new Set(bookmarks);
      newBkmks.delete(entryId);
      const call = sdkModules.db.settingsAttachment.put({
        moduleName: bmKey,
        services: [['entries-bookmarks', JSON.stringify(Array.from(newBkmks))]],
      });
      call.subscribe(async (_resp: any) => {
        setBookmarks(newBkmks);
      }, createErrorHandler('useEntryBookmark.removeBookmark', false, onError));
    },
  };

  return [bookmarks, actions];
};

export default useEntryBookmark;
