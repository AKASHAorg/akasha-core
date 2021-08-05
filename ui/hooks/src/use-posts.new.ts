import { QueryClient, useInfiniteQuery, useMutation, useQuery, useQueryClient } from 'react-query';
import { lastValueFrom } from 'rxjs';
import getSDK from '@akashaproject/awf-sdk';
import { buildPublishObject } from './utils/entry-utils';
import { DataProviderInput } from '@akashaproject/sdk-typings/lib/interfaces/common';
import { Post_Response } from '../../../sdk/typings/lib/interfaces/responses';

// these can be used with useQueryClient() to fetch data
export const ENTRY_KEY = 'Entry';
export const ENTRIES_KEY = 'Entries';
export const ENTRIES_BY_TAG_KEY = 'EntriesByTag';
export const ENTRIES_BY_AUTHOR_KEY = 'EntriesByAuthor';

const getPosts = async (queryClient: QueryClient, limit: number, offset?: string) => {
  const sdk = getSDK();
  const res = await lastValueFrom(
    sdk.api.entries.getEntries({
      limit: limit,
      offset: offset,
    }),
  );

  return {
    ...res.data.posts,
    results: res.data.posts.results.map(post => {
      queryClient.setQueryData([ENTRY_KEY, post._id], post);
      return post._id;
    }),
  };
};

// hook for fetching feed data
export function useInfinitePosts(limit: number, offset?: string) {
  const queryClient = useQueryClient();

  return useInfiniteQuery(
    ENTRIES_KEY,
    async ({ pageParam = offset }) => getPosts(queryClient, limit, pageParam),
    {
      getNextPageParam: lastPage => lastPage.nextIndex,
      //getPreviousPageParam: (lastPage, allPages) => lastPage.posts.results[0]._id,
      enabled: !!(offset || limit),
      keepPreviousData: true,
    },
  );
}

const getPostsByTag = async (
  queryClient: QueryClient,
  name: string,
  limit: number,
  offset?: string,
) => {
  const sdk = getSDK();
  const res = await lastValueFrom(
    sdk.api.entries.entriesByTag({
      name: name,
      limit: limit,
      offset: offset,
    }),
  );
  return {
    ...res.data.getPostsByTag,
    results: res.data.getPostsByTag.results.map(post => {
      queryClient.setQueryData([ENTRY_KEY, post._id], post);
      return post._id;
    }),
  };
};

// hook for fetching feed data
export function useInfinitePostsByTag(name: string, limit: number, offset?: string) {
  const queryClient = useQueryClient();
  return useInfiniteQuery(
    [ENTRIES_BY_TAG_KEY, name],
    async ({ pageParam = offset }) => getPostsByTag(queryClient, name, limit, pageParam),
    {
      getNextPageParam: lastPage => lastPage.nextIndex,
      //getPreviousPageParam: (lastPage, allPages) => lastPage.posts.results[0]._id,
      enabled: !!(offset || limit),
      keepPreviousData: true,
    },
  );
}

const getPostsByAuthor = async (
  queryClient: QueryClient,
  pubKey: string,
  limit: number,
  offset?: number,
) => {
  const sdk = getSDK();
  const res = await lastValueFrom(
    sdk.api.entries.entriesByAuthor({
      pubKey: pubKey,
      limit: limit,
      offset: offset,
    }),
  );

  return {
    ...res.data.getPostsByAuthor,
    results: res.data.getPostsByAuthor.results.map(post => {
      queryClient.setQueryData([ENTRY_KEY, post._id], post);
      return post._id;
    }),
  };
};

// hook for fetching feed data
export function useInfinitePostsByAuthor(pubKey: string, limit: number, offset?: number) {
  const queryClient = useQueryClient();
  return useInfiniteQuery(
    [ENTRIES_BY_AUTHOR_KEY, pubKey],
    async ({ pageParam = offset }) => getPostsByAuthor(queryClient, pubKey, limit, pageParam),
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
  const res = await lastValueFrom(sdk.api.entries.getEntry(postID));
  // remap the object props here
  return res.data.getPost;
};

// hook for fetching data for a specific postID/entryID
export function usePost(postID: string, enabler: boolean) {
  return useQuery([ENTRY_KEY, postID], () => getPost(postID), {
    enabled: !!postID && enabler,
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
      const previousPost: Post_Response = queryClient.getQueryData([ENTRY_KEY, postID]);
      // can add some optimistic updates here
      // ex: queryClient.setQueryData([ENTRY_KEY, postID], {})
      queryClient.setQueryData([ENTRY_KEY, postID], {
        ...previousPost,
        content: [
          {
            property: 'removed',
            provider: 'awf.graphql.comments.api',
            value: '1',
          },
        ],
      });
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

export const useEditPost = () => {
  const sdk = getSDK();
  const queryClient = useQueryClient();

  return useMutation(
    async (editedPost: any) => {
      const post = buildPublishObject(editedPost);
      const res = await lastValueFrom(
        sdk.api.entries.editEntry({ entryID: editedPost.entryID, ...post }),
      );
      return res.data.editPost;
    },
    {
      onMutate: async editedPost => {
        queryClient.setQueryData([ENTRY_KEY, editedPost.entryID], (current: Post_Response) => {
          const { data } = buildPublishObject(editedPost);
          return {
            ...current,
            content: data,
            isPublishing: true,
          };
        });

        return { editedPost };
      },
      onSuccess: async (data, vars) => {
        await queryClient.invalidateQueries([ENTRY_KEY, vars.entryID]);
        await queryClient.fetchQuery([ENTRY_KEY, vars.entryID], () => getPost(vars.entryID));
      },
    },
  );
};
