import { useMutation, useQuery, useQueryClient } from 'react-query';
import { lastValueFrom } from 'rxjs';
import getSDK from '@akashaproject/awf-sdk';
import { logError } from './utils/error-handler';
import { ItemTypes } from '@akashaproject/ui-awf-typings/lib/app-loader';

const BOOKMARKED_ENTRIES_KEY = 'AKASHA_APP_BOOKMARK_ENTRIES';
const BOOKMARK_SAVE_KEY = 'BOOKMARK_SAVE';
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

/*
 * Hook used to save bookmarks
 * can be used to bookmark replies and posts (itemType is passed to mutate()).
 */

export function useSaveBookmark() {
  const queryClient = useQueryClient();
  const sdk = getSDK();
  return useMutation(
    async () => {
      const bookmarks: { entryId: string; type: ItemTypes }[] =
        queryClient.getQueryData([BOOKMARKED_ENTRIES_KEY]) || [];
      const resp = await lastValueFrom(
        sdk.services.settings.set(BOOKMARKED_ENTRIES_KEY, [
          [entriesBookmarks, JSON.stringify(bookmarks)],
        ]),
      );
      if (resp.data) {
        return resp.data;
      }
      throw new Error('Cannot save bookmark.');
    },
    {
      onMutate: async (entryData: { entryId: string; itemType: ItemTypes }) => {
        const { entryId, itemType } = entryData;
        await queryClient.cancelQueries(BOOKMARKED_ENTRIES_KEY);
        const prevBmks: { entryId: string; type: ItemTypes }[] =
          queryClient.getQueryData([BOOKMARKED_ENTRIES_KEY]) || [];
        const newBmks = prevBmks.slice();
        newBmks.unshift({ entryId, type: itemType });
        queryClient.setQueryData([BOOKMARKED_ENTRIES_KEY], newBmks);
        return { prevBmks };
      },
      onError: (err, variables, context) => {
        if (context?.prevBmks) {
          queryClient.setQueryData([BOOKMARKED_ENTRIES_KEY], context.prevBmks);
        }
        logError('useBookmarks.bookmarkPost', err as Error);
      },
      onSuccess: () => {
        return queryClient.invalidateQueries([BOOKMARKED_ENTRIES_KEY]);
      },
      mutationKey: [BOOKMARK_SAVE_KEY],
    },
  );
}

export function useDeleteBookmark() {
  const sdk = getSDK();
  const queryClient = useQueryClient();
  return useMutation(
    () => {
      const bookmarks: { entryId: string; type: ItemTypes }[] =
        queryClient.getQueryData([BOOKMARKED_ENTRIES_KEY]) || [];

      return lastValueFrom(
        sdk.services.settings.set(BOOKMARKED_ENTRIES_KEY, [
          [entriesBookmarks, JSON.stringify(bookmarks)],
        ]),
      );
    },
    {
      onMutate: async (itemId: string) => {
        await queryClient.cancelQueries(BOOKMARKED_ENTRIES_KEY);

        const prevBmks: { entryId: string; type: ItemTypes }[] =
          queryClient.getQueryData([BOOKMARKED_ENTRIES_KEY]) || [];
        const newBmks = prevBmks.slice();
        const bmIndex = newBmks.findIndex(
          (bm: { entryId: string; type: ItemTypes }) => bm.entryId === itemId,
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
