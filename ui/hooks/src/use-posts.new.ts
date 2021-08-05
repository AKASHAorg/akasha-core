import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from 'react-query';
import { lastValueFrom } from 'rxjs';
import getSDK from '@akashaproject/awf-sdk';
import { mapEntry } from './utils/entry-utils';
import { logError } from './utils/error-handler';
import { DataProviderInput } from '@akashaproject/sdk-typings/lib/interfaces/common';
import { IAkashaError } from '@akashaproject/ui-awf-typings';

export const ENTRY_KEY = 'Entry';
export const ENTRIES_KEY = 'Entries';
export const ENTRIES_BY_TAG_KEY = 'EntriesByTag';
export const ENTRIES_BY_AUTHOR_KEY = 'EntriesByAuthor';

const getPosts = async (limit: number, offset?: string) => {
  const sdk = getSDK();
  try {
    const res = await lastValueFrom(
      sdk.api.entries.getEntries({
        limit: limit,
        offset: offset,
      }),
    );
    return res.data.posts;
  } catch (error) {
    logError('usePosts.getPosts', error);
  }
};

// hook for fetching feed data
export function useInfinitePosts(limit: number, offset?: string) {
  return useInfiniteQuery(
    ENTRIES_KEY,
    async ({ pageParam = offset }) => getPosts(limit, pageParam),
    {
      getNextPageParam: lastPage => lastPage.nextIndex,
      //getPreviousPageParam: (lastPage, allPages) => lastPage.posts.results[0]._id,
      enabled: !!(offset || limit),
      keepPreviousData: true,
    },
  );
}

const getPostsByTag = async (name: string, limit: number, offset?: string) => {
  const sdk = getSDK();
  try {
    const res = await lastValueFrom(
      sdk.api.entries.entriesByTag({
        name: name,
        limit: limit,
        offset: offset,
      }),
    );
    return res.data.getPostsByTag;
  } catch (error) {
    logError('usePosts.getPostsByTag', error);
  }
};

export function useInfinitePostsByTag(name: string, limit: number, offset?: string) {
  return useInfiniteQuery(
    [ENTRIES_BY_TAG_KEY, name],
    async ({ pageParam = offset }) => getPostsByTag(name, limit, pageParam),
    {
      getNextPageParam: lastPage => lastPage.nextIndex,
      //getPreviousPageParam: (lastPage, allPages) => lastPage.posts.results[0]._id,
      enabled: !!(offset || limit),
      keepPreviousData: true,
    },
  );
}

const getPostsByAuthor = async (pubKey: string, limit: number, offset?: number) => {
  const sdk = getSDK();
  try {
    const res = await lastValueFrom(
      sdk.api.entries.entriesByAuthor({
        pubKey: pubKey,
        limit: limit,
        offset: offset,
      }),
    );
    return res.data.getPostsByAuthor;
  } catch (error) {
    logError('usePosts.getPosts', error);
  }
};

export function useInfinitePostsByAuthor(pubKey: string, limit: number, offset?: number) {
  return useInfiniteQuery(
    [ENTRIES_BY_AUTHOR_KEY, pubKey],
    async ({ pageParam = offset }) => getPostsByAuthor(pubKey, limit, pageParam),
    {
      getNextPageParam: lastPage => lastPage.nextIndex,
      //getPreviousPageParam: (lastPage, allPages) => lastPage.posts.results[0]._id,
      enabled: !!(offset || limit),
      keepPreviousData: true,
    },
  );
}

const getPost = async postID => {
  const sdk = getSDK();
  try {
    const res = await lastValueFrom(sdk.api.entries.getEntry(postID));
    // remap the object props here
    return mapEntry(res.data.getPost);
  } catch (error) {
    logError('usePosts.getPost', error);
  }
};

// hook for fetching data for a specific postID/entryID
export function usePost(postID: string) {
  return useQuery([ENTRY_KEY, postID], () => getPost(postID), {
    enabled: !!postID,
    keepPreviousData: true,
  });
}

export interface Publish_Options {
  data: DataProviderInput[];
  post: { title?: string; tags?: string[]; quotes?: string[] };
}
/**
 * Example:
 * ```
 * const delPost = useDeletePost();
 * delPost.mutate("myEntryId");
 * ```
 */
export function useDeletePost(postID: string) {
  const sdk = getSDK();
  const queryClient = useQueryClient();
  return useMutation(postID => lastValueFrom(sdk.api.entries.removeEntry(postID)), {
    // When mutate is called:
    onMutate: async (postID: string) => {
      await queryClient.cancelQueries(ENTRY_KEY);

      // Snapshot the previous value
      const previousPost = queryClient.getQueryData([ENTRY_KEY, postID]);
      // can add some optimistic updates here
      // ex: queryClient.setQueryData([ENTRY_KEY, postID], {})

      return { previousPost };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, variables, context) => {
      if (context?.previousPost) {
        queryClient.setQueryData([ENTRY_KEY, postID], context.previousPost);
      }
      logError('usePosts.deletePost', err as IAkashaError);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries([ENTRY_KEY, postID]);
      await queryClient.invalidateQueries(ENTRIES_KEY);
    },
  });
}

export function useCreatePost() {
  const sdk = getSDK();
  const queryClient = useQueryClient();

  const pendingID = 'pending' + new Date().getTime();
  return useMutation(
    async (publishObj: Publish_Options) => {
      const res = await lastValueFrom(sdk.api.entries.postEntry(publishObj));
      return res?.data?.createPost;
    },
    {
      onMutate: async (publishObj: {
        data: DataProviderInput[];
        post: { title?: string; tags?: string[]; quotes?: string[] };
      }) => {
        const optimisticEntry = Object.assign({}, publishObj, { isPublishing: true });
        queryClient.setQueryData([ENTRY_KEY, pendingID], optimisticEntry);

        return { optimisticEntry };
      },
      onError: (err, variables, context) => {
        if (context?.optimisticEntry) {
          queryClient.setQueryData(
            [ENTRY_KEY, pendingID],
            Object.assign({}, context.optimisticEntry, { hasErrored: true }),
          );
        }
        logError('usePosts.createPost', err as IAkashaError);
      },
      onSuccess: async id => {
        await queryClient.fetchQuery([ENTRY_KEY, id], () => getPost(id));
      },
      onSettled: async () => {
        await queryClient.invalidateQueries([ENTRY_KEY, pendingID]);
        await queryClient.invalidateQueries(ENTRIES_KEY);
      },
    },
  );
}
