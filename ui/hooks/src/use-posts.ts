import { QueryClient, useInfiniteQuery, useMutation, useQuery, useQueryClient } from 'react-query';
import { lastValueFrom } from 'rxjs';
import getSDK from '@akashaproject/awf-sdk';
import { buildPublishObject } from './utils/entry-utils';
import { logError } from './utils/error-handler';
import { Post_Response } from '@akashaproject/sdk-typings/lib/interfaces/responses';
import { IPublishData, PostResponse } from '@akashaproject/ui-awf-typings/lib/entry';
import { IProfileData } from '@akashaproject/ui-awf-typings/lib/profile';
import { checkStatus } from './use-moderation';
import { SEARCH_KEY } from './use-search';
import { TRENDING_TAGS_KEY } from './use-trending';
import { PROFILE_KEY } from './use-profile';

export const ENTRY_KEY = 'Entry';
export const ENTRIES_KEY = 'Entries';
export const ENTRIES_CUSTOM_KEY = 'EntriesCustomFeed';
export const ENTRIES_BY_TAG_KEY = 'EntriesByTag';
export const ENTRIES_BY_AUTHOR_KEY = 'EntriesByAuthor';
export const CREATE_POST_MUTATION_KEY = 'CreatePost';

export type usePostParam = {
  postId: string;
  loggedUser?: string;
  enabler: boolean;
};

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
      return post._id;
    }),
  };
};

/**
 * Hook to get posts for feed, sorted chronologically
 */
export function useInfinitePosts(limit: number, offset?: string) {
  const queryClient = useQueryClient();

  return useInfiniteQuery(
    ENTRIES_KEY,
    async ({ pageParam = offset }) => getPosts(queryClient, limit, pageParam),
    {
      /* Return undefined to indicate there is no next page available. */
      getNextPageParam: lastPage => lastPage?.nextIndex,
      //getPreviousPageParam: (lastPage, allPages) => lastPage.posts.results[0]._id,
      enabled: !!(offset || limit),
      keepPreviousData: true,
      onError: (err: Error) => logError('usePosts.getPosts', err),
    },
  );
}

const getCustomFeedPosts = async (limit: number, offset?: number) => {
  const sdk = getSDK();
  const res = await lastValueFrom(
    sdk.api.entries.getFeedEntries({
      limit: limit,
      offset: offset,
    }),
  );
  return {
    ...res.data.getCustomFeed,
    results: res.data.getCustomFeed.results.map(post => {
      return post._id;
    }),
  };
};

/**
 * Hook to get posts for personalised user feed from followed profiles and subscribed tags,
 * sorted chronologically
 */
export function useInfiniteCustomPosts(enabler: boolean, limit: number, offset?: string) {
  return useInfiniteQuery(
    ENTRIES_CUSTOM_KEY,
    async ({ pageParam = offset }) => getCustomFeedPosts(limit, pageParam),
    {
      /* Return undefined to indicate there is no next page available. */
      getNextPageParam: lastPage => lastPage?.nextIndex,
      //getPreviousPageParam: (lastPage, allPages) => lastPage.posts.results[0]._id,
      enabled: !!(offset || limit) && enabler,
      keepPreviousData: true,
      onError: (err: Error) => logError('usePosts.getPosts', err),
    },
  );
}

const getPostsByTag = async (name: string, limit: number, offset?: string) => {
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
      return post._id;
    }),
  };
};

/**
 * Hook to get posts that contain a specific tag
 * @param name - tag name
 */
export function useInfinitePostsByTag(name: string, limit: number, offset?: string) {
  return useInfiniteQuery(
    [ENTRIES_BY_TAG_KEY, name],
    async ({ pageParam = offset }) => getPostsByTag(name, limit, pageParam),
    {
      /* Return undefined to indicate there is no next page available. */
      getNextPageParam: lastPage => lastPage?.nextIndex,
      //getPreviousPageParam: (lastPage, allPages) => lastPage.posts.results[0]._id,
      enabled: !!(offset || limit),
      onError: (err: Error) => logError('usePosts.getPostsByTag', err),
      // keepPreviousData: true,
    },
  );
}

const getPostsByAuthor = async (pubKey: string, limit: number, offset?: number) => {
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
      return post._id;
    }),
  };
};

/**
 * Hook to get an author's posts
 * @param pubKey - textile public key of the user
 */
export function useInfinitePostsByAuthor(
  pubKey: string,
  limit: number,
  enabled = true,
  offset?: number,
) {
  return useInfiniteQuery(
    [ENTRIES_BY_AUTHOR_KEY, pubKey],
    async ({ pageParam = offset }) => getPostsByAuthor(pubKey, limit, pageParam),
    {
      /* Return undefined to indicate there is no next page available. */
      getNextPageParam: lastPage => lastPage?.nextIndex,
      enabled: enabled,
      keepPreviousData: true,
      onError: (err: Error) => logError('usePosts.getPostsByAuthor', err),
    },
  );
}

const getPost = async (postID: string, loggedUser?: string) => {
  const sdk = getSDK();
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
};

/**
 * Hook to get data for a specific post
 * @param postId - id of the post
 * @param loggedUser - pubKey of the currently logged in user
 */
export function usePost({ postId, loggedUser, enabler = true }: usePostParam) {
  return useQuery([ENTRY_KEY, postId], () => getPost(postId, loggedUser), {
    enabled: !!(postId && enabler),
    keepPreviousData: true,
    onError: (err: Error) => logError('usePosts.getPost', err),
  });
}

/**
 * Hook to delete a post
 * @param postID - id of the post to be deleted
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
        updatedAt: Date.now().toString(),
        isRemoved: true,
      });
      return { previousPost };
    },
    onSuccess: async () => {
      const user = await lastValueFrom(sdk.api.auth.getCurrentUser());
      if (user) {
        queryClient.setQueryData<IProfileData>([PROFILE_KEY, user.data?.pubKey], profile => {
          const postsCount = profile.totalPosts;
          let totalPosts: number;
          if (typeof postsCount === 'number') {
            totalPosts = Math.max(0, postsCount - 1);
          } else {
            totalPosts = Math.max(0, parseInt(postsCount, 10) - 1);
          }
          return {
            ...profile,
            totalPosts,
          };
        });
      }
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

/**
 * Hook to create a new post
 * pass the publish data from the editor to the mutate function
 */
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
        await queryClient.invalidateQueries(TRENDING_TAGS_KEY);
      },
      mutationKey: CREATE_POST_MUTATION_KEY,
    },
  );
}
const updateSearchEntry = (postIndex, slateContent) => (entry, index) => {
  if (index !== postIndex) {
    return entry;
  }
  return {
    ...entry,
    slateContent,
    updatedAt: Date.now().toString(),
  };
};

/**
 * Hook to edit a post
 * pass the edited post data to the mutation function
 */
export const useEditPost = () => {
  const sdk = getSDK();
  const queryClient = useQueryClient();

  return useMutation(
    async (editedPost: IPublishData & { entryID: string }) => {
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
            updatedAt: Date.now().toString(),
          };
        });
        queryClient.setQueriesData<unknown>(SEARCH_KEY, oldData => {
          if (!oldData) return;
          const postIndex = oldData.entries.findIndex(
            entry => entry.entryId === editedPost.entryID,
          );
          const commentIndex = oldData.comments.findIndex(
            entry => entry.entryId === editedPost.entryID,
          );
          if (postIndex > -1) {
            return {
              ...oldData,
              entries: oldData.entries.map(updateSearchEntry(postIndex, editedPost.slateContent)),
            };
          }
          if (commentIndex > -1) {
            return {
              ...oldData,
              comments: oldData.entries.map(
                updateSearchEntry(commentIndex, editedPost.slateContent),
              ),
            };
          }
          return oldData;
        });

        return { editedPost };
      },
      onSuccess: async (data, vars) => {
        await queryClient.invalidateQueries([ENTRY_KEY, vars.entryID]);
        await queryClient.fetchQuery([ENTRY_KEY, vars.entryID], () => getPost(vars.entryID));
      },
      onError: (err: Error) => logError('usePosts.editPost', err),
    },
  );
};
