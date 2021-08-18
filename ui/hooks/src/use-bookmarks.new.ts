import { useMutation, useQuery, useQueryClient } from 'react-query';
import { lastValueFrom } from 'rxjs';
import getSDK from '@akashaproject/awf-sdk';
import { logError } from './utils/error-handler';

export enum BookmarkTypes {
  POST = 0,
  COMMENT,
}

const BOOKMARKED_ENTRIES_KEY = 'AKASHA_APP_BOOKMARK_ENTRIES';
const entriesBookmarks = 'entries-bookmarks';

const getBookmarks = async () => {
  const sdk = getSDK();
  try {
    const res = await lastValueFrom(sdk.services.settings.get(BOOKMARKED_ENTRIES_KEY));
    return res.data;
  } catch (error) {
    logError('useBookmarks.getBookmarks', error);
  }
};

export function useGetBookmarks(loggedEthAddress) {
  return useQuery(
    [BOOKMARKED_ENTRIES_KEY],
    async () => {
      const data = await getBookmarks();

      if (data && data.options) {
        const bookmarkedEntries = data.options.findIndex(
          (e: string[]) => e[0] === entriesBookmarks,
        );
        if (bookmarkedEntries !== -1) {
          return JSON.parse(data.options[bookmarkedEntries][1]);
        }
      }
    },
    {
      initialData: [],
      enabled: !!loggedEthAddress,
    },
  );
}

export function useBookmarkPost() {
  const sdk = getSDK();
  const queryClient = useQueryClient();
  return useMutation(
    (_entryId: string) => {
      const bookmarks: { entryId: string; type: BookmarkTypes }[] =
        queryClient.getQueryData([BOOKMARKED_ENTRIES_KEY]) || [];
      return lastValueFrom(
        sdk.services.settings.set(BOOKMARKED_ENTRIES_KEY, [
          [entriesBookmarks, JSON.stringify(bookmarks)],
        ]),
      );
    },
    {
      onMutate: async (entryId: string) => {
        await queryClient.cancelQueries(BOOKMARKED_ENTRIES_KEY);

        const prevBmks: { entryId: string; type: BookmarkTypes }[] =
          queryClient.getQueryData([BOOKMARKED_ENTRIES_KEY]) || [];
        const newBmks = prevBmks.slice();
        newBmks.unshift({ entryId, type: BookmarkTypes.POST });
        queryClient.setQueryData([BOOKMARKED_ENTRIES_KEY], newBmks);
        return { prevBmks };
      },
      onError: (err, variables, context) => {
        if (context?.prevBmks) {
          queryClient.setQueryData([BOOKMARKED_ENTRIES_KEY], context.prevBmks);
        }
        logError('useBookmarks.bookmarkPost', err as Error);
      },
      onSettled: async () => {
        await queryClient.invalidateQueries([BOOKMARKED_ENTRIES_KEY]);
      },
    },
  );
}

export function useBookmarkComment() {
  const sdk = getSDK();
  const queryClient = useQueryClient();
  return useMutation(
    (_entryId: string) => {
      const bookmarks: { entryId: string; type: BookmarkTypes }[] =
        queryClient.getQueryData([BOOKMARKED_ENTRIES_KEY]) || [];
      return lastValueFrom(
        sdk.services.settings.set(BOOKMARKED_ENTRIES_KEY, [
          [entriesBookmarks, JSON.stringify(bookmarks)],
        ]),
      );
    },
    {
      onMutate: async (entryId: string) => {
        await queryClient.cancelQueries(BOOKMARKED_ENTRIES_KEY);

        const prevBmks: { entryId: string; type: BookmarkTypes }[] =
          queryClient.getQueryData([BOOKMARKED_ENTRIES_KEY]) || [];
        const newBmks = prevBmks.slice();
        newBmks.unshift({ entryId, type: BookmarkTypes.COMMENT });
        queryClient.setQueryData([BOOKMARKED_ENTRIES_KEY], newBmks);
        return { prevBmks };
      },
      onError: (err, variables, context) => {
        if (context?.prevBmks) {
          queryClient.setQueryData([BOOKMARKED_ENTRIES_KEY], context.prevBmks);
        }
        logError('useBookmarks.bookmarkComment', err as Error);
      },
      onSettled: async () => {
        await queryClient.invalidateQueries([BOOKMARKED_ENTRIES_KEY]);
      },
    },
  );
}

export function useBookmarkDelete() {
  const sdk = getSDK();
  const queryClient = useQueryClient();
  return useMutation(
    (_entryId: string) => {
      const bookmarks: { entryId: string; type: BookmarkTypes }[] =
        queryClient.getQueryData([BOOKMARKED_ENTRIES_KEY]) || [];

      return lastValueFrom(
        sdk.services.settings.set(BOOKMARKED_ENTRIES_KEY, [
          [entriesBookmarks, JSON.stringify(bookmarks)],
        ]),
      );
    },
    {
      onMutate: async (entryId: string) => {
        await queryClient.cancelQueries(BOOKMARKED_ENTRIES_KEY);

        const prevBmks: { entryId: string; type: BookmarkTypes }[] =
          queryClient.getQueryData([BOOKMARKED_ENTRIES_KEY]) || [];
        const newBmks = prevBmks.slice();
        const bmIndex = newBmks.findIndex(
          (bm: { entryId: string; type: BookmarkTypes }) => bm.entryId === entryId,
        );
        if (bmIndex >= 0) {
          newBmks.splice(bmIndex, 1);
        }
        queryClient.setQueryData([BOOKMARKED_ENTRIES_KEY], newBmks);
        return { prevBmks };
      },
      onError: (err, variables, context) => {
        if (context?.prevBmks) {
          queryClient.setQueryData([BOOKMARKED_ENTRIES_KEY], context.prevBmks);
        }
        logError('useBookmarks.bookmarkDelete', err as Error);
      },
      onSettled: async () => {
        await queryClient.invalidateQueries([BOOKMARKED_ENTRIES_KEY]);
      },
    },
  );
}
