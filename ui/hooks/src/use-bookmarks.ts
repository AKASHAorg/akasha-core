import { useMutation, useQuery, useQueryClient } from 'react-query';
import getSDK from '@akashaorg/awf-sdk';
import { EntityTypes } from '@akashaorg/typings/ui';
import { logError } from './utils/error-handler';

export const BOOKMARKED_ENTRIES_KEY = 'AKASHA_APP_BOOKMARK_ENTRIES';
export const BOOKMARK_SAVE_KEY = 'BOOKMARK_SAVE';
const entriesBookmarks = 'entries-bookmarks';

/**
 * Hook for gettting a user's saved posts and comments
 * @example useGetBookmarks hook
 * ```typescript
 * const getBookmarksQuery = useGetBookmarks('0x243kb4bret');
 *
  const bookmarks = getBookmarksQuery.data;
 * ```
 */
export function useGetBookmarks(loggedEthAddress: string, enabler = true) {
  return useQuery<Record<string, unknown>[]>(
    [BOOKMARKED_ENTRIES_KEY],
    async () => {
      const sdk = getSDK();
      try {
        const doc = await sdk.services.settings.get<string[][]>(BOOKMARKED_ENTRIES_KEY);
        if (doc.data && doc.data.options.length) {
          const bookmarkedEntries = doc.data.options.findIndex(
            (e: string[]) => e[0] === entriesBookmarks,
          );
          if (bookmarkedEntries !== -1) {
            return JSON.parse(doc.data.options[bookmarkedEntries][1]);
          }
        }
      } catch (error) {
        logError('useBookmarks.getBookmarks', error);
        throw error;
      }
    },
    {
      initialData: [],
      enabled: !!loggedEthAddress && enabler,
    },
  );
}

/**
 * Hook used to bookmark resources.
 * Pass as payload, entryData containing the resource id and itemType to the mutate function.
 * @example useSaveBookmark hook
 * ```typescript
 * const saveBookmarkQuery = useSaveBookmark();
 *
  saveBookmarkQuery.mutate({entryId: 'dbkjjouyahljfe', itemType: 'item type'});
 * ```
 */

export function useSaveBookmark() {
  const queryClient = useQueryClient();
  const sdk = getSDK();
  return useMutation(
    async () => {
      const bookmarks: { entryId: string; type: EntityTypes }[] =
        queryClient.getQueryData([BOOKMARKED_ENTRIES_KEY]) || [];
      const resp = await sdk.services.settings.set(BOOKMARKED_ENTRIES_KEY, [
        [entriesBookmarks, JSON.stringify(bookmarks)],
      ]);
      if (resp.data) {
        return resp.data;
      }
      throw new Error('Cannot save bookmark.');
    },
    {
      onMutate: async (entryData: { entryId: string; itemType: EntityTypes }) => {
        const { entryId, itemType } = entryData;
        await queryClient.cancelQueries(BOOKMARKED_ENTRIES_KEY);
        const prevBmks: { entryId: string; type: EntityTypes }[] =
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

/**
 * Hook used to delete a bookmark
 * @example useDeleteBookmark hook
 * ```typescript
 * const deleteBookmarkQuery = useDeleteBookmark();
 *
  deleteBookmarkQuery.mutate('dbkjjouyahljfe');
 * ```
 */
export function useDeleteBookmark() {
  const sdk = getSDK();
  const queryClient = useQueryClient();
  return useMutation(
    () => {
      const bookmarks: { entryId: string; type: EntityTypes }[] =
        queryClient.getQueryData([BOOKMARKED_ENTRIES_KEY]) || [];

      return sdk.services.settings.set(BOOKMARKED_ENTRIES_KEY, [
        [entriesBookmarks, JSON.stringify(bookmarks)],
      ]);
    },
    {
      onMutate: async (itemId: string) => {
        await queryClient.cancelQueries(BOOKMARKED_ENTRIES_KEY);

        const prevBmks: { entryId: string; type: EntityTypes }[] =
          queryClient.getQueryData([BOOKMARKED_ENTRIES_KEY]) || [];
        const newBmks = prevBmks.slice();
        const bmIndex = newBmks.findIndex(
          (bm: { entryId: string; type: EntityTypes }) => bm.entryId === itemId,
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
