import { QueryClient, useInfiniteQuery, useMutation, useQuery, useQueryClient } from 'react-query';
import { lastValueFrom } from 'rxjs';
import getSDK from '@akashaproject/awf-sdk';
import { buildPublishObject } from './utils/entry-utils';
import { logError } from './utils/error-handler';
import { DataProviderInput } from '@akashaproject/sdk-typings/lib/interfaces/common';
import { Post_Response } from '@akashaproject/sdk-typings/lib/interfaces/responses';
import { IPublishData, PostResponse } from '@akashaproject/ui-awf-typings/lib/entry';
import { checkStatus } from './use-moderation';
import { SEARCH_KEY } from './use-search.new';

export const ENTRY_KEY = 'Entry';
export const ENTRIES_KEY = 'Entries';
export const ENTRIES_BY_TAG_KEY = 'EntriesByTag';
export const ENTRIES_BY_AUTHOR_KEY = 'EntriesByAuthor';
export const CREATE_POST_MUTATION_KEY = 'CreatePost';

export interface Publish_Options {
  data: DataProviderInput[];
  post: { title?: string; tags?: string[]; quotes?: string[] };
}

export type usePostParam = {
  postId: string;
  loggedUser?: string;
  enabler: boolean;
};

const getPosts = async (queryClient: QueryClient, limit: number, offset?: string) => {
  const sdk = getSDK();
  try {
    const res = await lastValueFrom(
      sdk.api.entries.getEntries({
        limit: limit,
        offset: offset,
      }),
    );
    return {
      ...res.data.posts,
      results: res.data.posts.results.map(post => {
        return post._id;
      }),
    };
  } catch (error) {
    logError('usePosts.getPosts', error);
  }
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
  try {
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
        return post._id;
      }),
    };
  } catch (error) {
    logError('usePosts.getPostsByTag', error);
  }
};

export function useInfinitePostsByTag(name: string, limit: number, offset?: string) {
  const queryClient = useQueryClient();
  return useInfiniteQuery(
    [ENTRIES_BY_TAG_KEY, name],
    async ({ pageParam = offset }) => getPostsByTag(queryClient, name, limit, pageParam),
    {
      getNextPageParam: lastPage => lastPage.nextIndex,
      //getPreviousPageParam: (lastPage, allPages) => lastPage.posts.results[0]._id,
      enabled: !!(offset || limit),
      // keepPreviousData: true,
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
  try {
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
        return post._id;
      }),
    };
  } catch (error) {
    logError('usePosts.getPostsByAuthor', error);
    throw error;
  }
};

export function useInfinitePostsByAuthor(
  pubKey: string,
  limit: number,
  enabled = true,
  offset?: number,
) {
  const queryClient = useQueryClient();
  return useInfiniteQuery(
    [ENTRIES_BY_AUTHOR_KEY, pubKey],
    async ({ pageParam = offset }) => getPostsByAuthor(queryClient, pubKey, limit, pageParam),
    {
      getNextPageParam: lastPage => !!lastPage && lastPage.nextIndex,
      enabled: enabled,
      keepPreviousData: true,
    },
  );
}

const getPost = async (postID: string, loggedUser?: string) => {
  const sdk = getSDK();

  try {
    const user = await lastValueFrom(sdk.api.auth.getCurrentUser());
    // check entry's moderation status
    const modStatus = await checkStatus({
      user: loggedUser || user?.data?.pubKey || '',
      contentIds: [postID],
    });
    const res = await lastValueFrom(sdk.api.entries.getEntry(postID));
    const modStatusAuthor = await checkStatus({
      user: loggedUser || user?.data?.pubKey || '',
      contentIds: [res.data?.getPost?.author?.pubKey],
    });
    return {
      ...res.data.getPost,
      ...modStatus[0],
      author: { ...res.data.getPost.author, ...modStatusAuthor[0] },
    };
  } catch (error) {
    logError('usePosts.getPost', error);
    throw error;
  }
};

// hook for fetching data for a specific postID/entryID
export function usePost({ postId, loggedUser, enabler = true }: usePostParam) {
  return useQuery([ENTRY_KEY, postId], () => getPost(postId, loggedUser), {
    enabled: !!(postId && enabler),
    keepPreviousData: true,
  });
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
      await queryClient.cancelQueries([ENTRY_KEY, postID]);

      // Snapshot the previous value
      const previousPost: Post_Response = queryClient.getQueryData([ENTRY_KEY, postID]);

      queryClient.setQueryData([ENTRY_KEY, postID], {
        ...previousPost,
        content: [
          {
            property: 'removed',
            provider: 'awf.graphql.posts.api',
            value: '1',
          },
        ],
        isRemoved: true,
      });
      return { previousPost };
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries([ENTRY_KEY, postID]);
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, variables, context) => {
      if (context?.previousPost) {
        queryClient.setQueryData([ENTRY_KEY, postID], context.previousPost);
      }
      logError('usePosts.deletePost', err as Error);
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
    async (publishObj: IPublishData) => {
      const post = buildPublishObject(publishObj);
      const res = await lastValueFrom(sdk.api.entries.postEntry(post));
      return res?.data?.createPost;
    },
    {
      onMutate: async (publishObj: IPublishData) => {
        await queryClient.cancelQueries(ENTRIES_KEY);
        await queryClient.cancelQueries([ENTRIES_BY_AUTHOR_KEY, publishObj.pubKey]);
        const optimisticEntry = Object.assign({}, publishObj, { isPublishing: true });

        return { optimisticEntry, entryId: pendingID };
      },
      onError: err => {
        logError('usePosts.createPost', err as Error);
      },
      onSuccess: async id => {
        await queryClient.fetchQuery([ENTRY_KEY, id], () => getPost(id));
      },
      onSettled: async () => {
        await queryClient.invalidateQueries(ENTRIES_KEY);
      },
      mutationKey: CREATE_POST_MUTATION_KEY,
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
        queryClient.setQueryData([ENTRY_KEY, editedPost.entryID], (current: PostResponse) => {
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
        await queryClient.invalidateQueries(SEARCH_KEY);
        await queryClient.fetchQuery([ENTRY_KEY, vars.entryID], () => getPost(vars.entryID));
      },
    },
  );
};
