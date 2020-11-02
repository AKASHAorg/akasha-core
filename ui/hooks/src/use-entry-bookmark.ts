import * as React from 'react';
import { Subscription } from 'rxjs';

export interface UseEntryBookmarkProps {
  ethAddress: string | null;
  bmKey?: string;
  sdkModules: { [key: string]: any };
  logger?: any;
  onError: (err: Error) => void;
}

export interface IBookmarkActions {
  addBookmark: (entryId: string) => void;
  removeBookmark: (entryId: string) => void;
}

const BOOKMARKED_ENTRIES_KEY = 'FEED_APP_BOOKMARK_ENTRIES';

const useEntryBookmark = (props: UseEntryBookmarkProps): [Set<string>, IBookmarkActions] => {
  const { ethAddress, sdkModules, bmKey = BOOKMARKED_ENTRIES_KEY, onError, logger } = props;
  const [bookmarks, setBookmarks] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    let subs: Subscription | undefined;
    if (ethAddress) {
      if (sdkModules && sdkModules.hasOwnProperty('db')) {
        const call = sdkModules.db.settingsAttachment.get({
          ethAddress,
          id: bmKey,
        });
        subs = call.subscribe(
          (resp: any) => {
            const { data } = resp;
            if (data) {
              setBookmarks(new Set(JSON.parse(data)));
            }
          },
          (err: Error) => onError(err),
        );
      } else {
        if (logger) {
          logger.error('Cannot get bookmarks, DB package not loaded!');
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
        ethAddress,
        obj: {
          data: JSON.stringify(Array.from(newBmks)),
          type: 'string',
          id: bmKey,
        },
      });
      call.subscribe(
        async (resp: any) => {
          const attachment = await resp.data.doc.getAttachment(bmKey);
          const textArr = await attachment.getStringData();
          setBookmarks(new Set(JSON.parse(textArr)));
        },
        (err: Error) => onError(err),
      );
    },
    removeBookmark: entryId => {
      const newBkmks = new Set(bookmarks);
      newBkmks.delete(entryId);
      const call = sdkModules.db.settingsAttachment.put({
        ethAddress,
        obj: {
          data: JSON.stringify(Array.from(newBkmks)),
        },
      });
      call.subscribe(
        async (resp: any) => {
          const attachment = await resp.data.doc.getAttachment(bmKey);
          const textArr = await attachment.getStringData();
          setBookmarks(new Set(JSON.parse(textArr)));
        },
        (err: Error) => onError(err),
      );
    },
  };

  return [bookmarks, actions];
};

export default useEntryBookmark;
