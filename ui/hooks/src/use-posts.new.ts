import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from 'react-query';
import { lastValueFrom } from 'rxjs';
import getSDK from '@akashaproject/awf-sdk';
import { mapEntry } from './utils/entry-utils';
import { DataProviderInput } from '@akashaproject/sdk-typings/lib/interfaces/common';

// these can be used with useQueryClient() to fetch data
export const ENTRY_KEY = 'Entry';
export const ENTRIES_KEY = 'Entries';

const getPosts = async (limit: number, offset?: string) => {
  const sdk = getSDK();
  const res = await lastValueFrom(
    sdk.api.entries.getEntries({
      limit: limit,
      offset: offset,
    }),
  );
  // @Todo: Remap this?
  return res.data.posts;
};

// hook for fetching feed data
export function useInfinitePosts(limit: number, offset?: string) {
  return useInfiniteQuery(
    ENTRIES_KEY,
    async ({ pageParam = offset }) => getPosts(limit, pageParam),
    {
      getNextPageParam: (lastPage, allPages) => lastPage.nextIndex,
      //getPreviousPageParam: (lastPage, allPages) => lastPage.posts.results[0]._id,
      enabled: !!(offset || limit),
      keepPreviousData: true,
    },
  );
}

const getPost = async postID => {
  const sdk = getSDK();
  const ipfsGateway = sdk.services.common.ipfs.getSettings().gateway;
  const res = await lastValueFrom(sdk.api.entries.getEntry(postID));
  // remap the object props here
  return mapEntry(res.data.getPost, ipfsGateway);
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
