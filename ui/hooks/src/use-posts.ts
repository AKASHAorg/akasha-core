import {
  QueryClient,
  useInfiniteQuery,
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from 'react-query';
import getSDK from '@akashaorg/awf-sdk';
import { PostResultFragment } from '@akashaorg/typings/sdk/graphql-operation-types';
import { IPublishData, IProfileData } from '@akashaorg/typings/ui';
import { buildPublishObject } from './utils/entry-utils';
import { logError } from './utils/error-handler';
import { checkStatus } from './use-moderation';
import { SEARCH_KEY } from './use-search';
import { TRENDING_TAGS_KEY } from './use-trending';
import { PROFILE_KEY } from './use-profile';
import { checkPostActive } from './utils/checkPostActive';

/**
 * @internal
 */
export const ENTRY_KEY = 'Entry';
/**
 * @internal
 */
export const ENTRIES_KEY = 'Entries';
/**
 * @internal
 */
export const ENTRIES_CUSTOM_KEY = 'EntriesCustomFeed';
/**
 * @internal
 */
export const ENTRIES_BY_TAG_KEY = 'EntriesByTag';
/**
 * @internal
 */
export const ENTRIES_BY_AUTHOR_KEY = 'EntriesByAuthor';
/**
 * @internal
 */
export const CREATE_POST_MUTATION_KEY = 'CreatePost';

export type usePostParam = {
  postId: string;
  loggedUser?: string;
  enabler: boolean;
};

export type usePostsParam = {
  postIds: string[];
  loggedUser?: string;
  enabler: boolean;
};

const getPosts = async (
  queryClient: QueryClient,
  limit: number,
  offset?: string,
  filterDeleted = true,
) => {
  const sdk = getSDK();
  const res = await sdk.api.entries.getEntries({
    limit: limit,
    offset: offset,
  });

  let posts = res.posts.results;

  if (filterDeleted) {
    posts = posts.filter(post => checkPostActive({ content: post.content }));
  }

  const postsIds = posts.map(post => {
    return post._id;
  });

  return {
    ...res.posts,
    results: postsIds,
  };
};

/**
 * Hook to get posts for feed, sorted chronologically
 * @example useInfinitePosts hook
 * ```typescript
 * const postsQuery = useInfinitePosts(15);
 *
 * const postPages = React.useMemo(() => {
    if (postsQuery.data) {
      return postsQuery.data.pages;
    }
    return [];
  }, [postsQuery.data]);
 *
 * // load more posts
 * const handleLoadMore = React.useCallback(() => {
    if (!postsQuery.isLoading && postsQuery.hasNextPage && loginState?.fromCache) {
      postsQuery.fetchNextPage();
    }
  }, [postsQuery, loginState?.fromCache]);
 * ```
 */
export function useInfinitePosts(limit: number, offset?: string) {
  const queryClient = useQueryClient();

  return useInfiniteQuery(
    ENTRIES_KEY,
    async ({ pageParam = offset }) => getPosts(queryClient, limit, pageParam),
    {
      /* Return undefined to indicate there is no next page available. */
      getNextPageParam: lastPage => lastPage?.nextIndex || undefined,
      //getPreviousPageParam: (lastPage, allPages) => lastPage.posts.results[0]._id,
      enabled: !!(offset || limit),
      keepPreviousData: true,
      onError: (err: Error) => logError('usePosts.getPosts', err),
    },
  );
}

const getCustomFeedPosts = async (limit: number, offset?: number) => {
  const sdk = getSDK();
  const res = await sdk.api.entries.getFeedEntries({
    limit: limit,
    offset: offset,
  });
  return {
    ...res.getCustomFeed,
    results: res.getCustomFeed.results.map(post => {
      return post._id;
    }),
  };
};

/**
 * Hook to get posts for personalised user feed from followed profiles and subscribed tags,
 * sorted chronologically
 * @example useInfiniteCustomPosts hook
 * ```typescript
 * const customPostsQuery = useInfiniteCustomPosts(true, 15);
 *
 * const postPages = React.useMemo(() => {
    if (customPostsQuery.data) {
      return customPostsQuery.data.pages;
    }
    return [];
  }, [customPostsQuery.data]);
 *
 * // load more posts
 * const handleLoadMore = React.useCallback(() => {
    if (!customPostsQuery.isLoading && customPostsQuery.hasNextPage && loginState?.fromCache) {
      customPostsQuery.fetchNextPage();
    }
  }, [customPostsQuery, loginState?.fromCache]);
 * ```
 */
export function useInfiniteCustomPosts(enabler: boolean, limit: number, offset?: string) {
  return useInfiniteQuery(
    ENTRIES_CUSTOM_KEY,
    async ({ pageParam = offset }) => getCustomFeedPosts(limit, pageParam),
    {
      /* Return undefined to indicate there is no next page available. */
      getNextPageParam: lastPage => lastPage?.nextIndex || undefined,
      //getPreviousPageParam: (lastPage, allPages) => lastPage.posts.results[0]._id,
      enabled: !!(offset || limit) && enabler,
      keepPreviousData: true,
      onError: (err: Error) => logError('usePosts.getPosts', err),
    },
  );
}

const getPostsByTag = async (tagName: string, limit: number, offset?: number) => {
  const sdk = getSDK();
  const res = await sdk.api.entries.entriesByTag({
    name: tagName,
    limit: limit,
    offset: offset,
  });
  return {
    ...res.getPostsByTag,
    results: res.getPostsByTag.results.map(post => {
      return post._id;
    }),
  };
};

/**
 * Hook to get posts that contain a specific tag
 * @example useInfinitePostsByTag hook
 * ```typescript
 * const tagPostsQuery = useInfinitePostsByTag('awesometag', 15);
 *
 * const postPages = React.useMemo(() => {
    if (tagPostsQuery.data) {
      return tagPostsQuery.data.pages;
    }
    return [];
  }, [tagPostsQuery.data]);
 *
 * // load more posts
 * const handleLoadMore = React.useCallback(() => {
    if (!tagPostsQuery.isLoading && tagPostsQuery.hasNextPage && loginState?.fromCache) {
      tagPostsQuery.fetchNextPage();
    }
  }, [tagPostsQuery, loginState?.fromCache]);
 * ```
 */
export function useInfinitePostsByTag(tagName: string, limit: number, offset?: string) {
  return useInfiniteQuery(
    [ENTRIES_BY_TAG_KEY, tagName],
    async ({ pageParam = offset }) => getPostsByTag(tagName, limit, pageParam),
    {
      /* Return undefined to indicate there is no next page available. */
      getNextPageParam: lastPage => lastPage?.nextIndex || undefined,
      //getPreviousPageParam: (lastPage, allPages) => lastPage.posts.results[0]._id,
      enabled: !!(offset || limit),
      onError: (err: Error) => logError('usePosts.getPostsByTag', err),
      // keepPreviousData: true,
    },
  );
}

const getPostsByAuthor = async (pubKey: string, limit: number, offset?: number) => {
  const sdk = getSDK();
  const res = await sdk.api.entries.entriesByAuthor({
    pubKey: pubKey,
    limit: limit,
    offset: offset,
  });
  return {
    ...res.getPostsByAuthor,
    results: res.getPostsByAuthor.results.map(post => {
      return post._id;
    }),
  };
};

/**
 * Hook to get an author's posts
 * @example useInfinitePostsByAuthor hook
 * ```typescript
 * const authorPostsQuery = useInfinitePostsByAuthor('author-public-key', 15);
 *
 * const postPages = React.useMemo(() => {
    if (authorPostsQuery.data) {
      return authorPostsQuery.data.pages;
    }
    return [];
  }, [authorPostsQuery.data]);
 *
 * // load more posts
 * const handleLoadMore = React.useCallback(() => {
    if (!authorPostsQuery.isLoading && authorPostsQuery.hasNextPage && loginState?.fromCache) {
      authorPostsQuery.fetchNextPage();
    }
  }, [authorPostsQuery, loginState?.fromCache]);
 * ```
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
      getNextPageParam: lastPage => lastPage?.nextIndex || undefined,
      enabled: enabled,
      keepPreviousData: true,
      onError: (err: Error) => logError('usePosts.getPostsByAuthor', err),
    },
  );
}

const getPost = async (postID: string, loggedUser?: string) => {
  const sdk = getSDK();
  const user = await sdk.api.auth.getCurrentUser();
  // check entry's moderation status
  const modStatus = await checkStatus({
    user: loggedUser || user?.pubKey || '',
    contentIds: [postID],
  });
  const res = await sdk.api.entries.getEntry(postID);
  const modStatusAuthor = await checkStatus({
    user: loggedUser || user?.pubKey || '',
    contentIds: [res.getPost?.author?.pubKey],
  });
  return {
    ...res.getPost,
    ...modStatus[0],
    author: { ...res.getPost.author, ...modStatusAuthor[0] },
  };
};

/**
 * Hook to get data for a specific post
 * @example usePost hook
 * ```typescript
 * const postQuery = usePost('some-post-id', 'logged-user-pubkey', true);
 *
 * const entryData = React.useMemo(() => {
    if (postQuery.data) {
      // mapEntry is a utility function that transforms the comment/post data into required format.
      return mapEntry(postQuery.data);
    }
    return undefined;
  }, [postQuery.data]);
 * ```
 */
export function usePost({ postId, loggedUser, enabler = true }: usePostParam) {
  return useQuery([ENTRY_KEY, postId], () => getPost(postId, loggedUser), {
    enabled: !!(postId && enabler),
    keepPreviousData: true,
    onError: (err: Error) => logError('usePosts.getPost', err),
  });
}

/**
 * Hook to get an array of post data
 * @example usePosts hook
 * ```typescript
 * const postQueries = usePost({ postIds: ['some-post-id', 'some-other-post-id'], loggedUser: 'logged-user-pubkey', enabler: true });
 *
 * const entryData = postQueries.map(postQuery=>postQuery.data);
 * ```
 */
export function usePosts({ postIds, loggedUser, enabler = true }: usePostsParam) {
  const options = postId => ({
    enabled: !!(postId && enabler),
    retry: 3,
    retryDelay: 1000,
    onError: (err: Error) => logError('usePosts.getPost', err),
  });
  const queries = postIds.map(postId => ({
    queryKey: [ENTRY_KEY, postId],
    queryFn: () => getPost(postId, loggedUser),
    ...options(postId),
  }));
  return useQueries(queries);
}

/**
 * Hook to delete a post
 * @example useDeletePost hook
 * ```typescript
 * const deletePostQuery = useDeletePost('some-post-id');
 *
 * deletePostQuery.mutate('some-post-id');
 * ```
 */
export function useDeletePost(postID: string) {
  const sdk = getSDK();
  const queryClient = useQueryClient();
  return useMutation(postID => sdk.api.entries.removeEntry(postID), {
    // When mutate is called:
    onMutate: async (postID: string) => {
      await queryClient.cancelQueries([ENTRY_KEY, postID]);

      // Snapshot the previous value
      const previousPost: PostResultFragment = queryClient.getQueryData([ENTRY_KEY, postID]);

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
      const user = await sdk.api.auth.getCurrentUser();
      if (user) {
        queryClient.setQueryData<IProfileData>([PROFILE_KEY, user.pubKey], profile => {
          const postsCount = profile.totalPosts;
          let totalPosts: string;
          if (typeof postsCount === 'number') {
            totalPosts = JSON.stringify(Math.max(0, postsCount - 1));
          } else {
            totalPosts = JSON.stringify(Math.max(0, parseInt(postsCount, 10) - 1));
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
 * @example useCreatePost hook
 * ```typescript
 * const publishPostQuery = useCreatePost();
 *
 * publishPostQuery.mutate({ pubKey: 'author-public-key', ...});
 * ```
 */
export function useCreatePost() {
  const sdk = getSDK();
  const queryClient = useQueryClient();

  const pendingID = 'pending' + new Date().getTime();
  return useMutation(
    async (publishObj: IPublishData) => {
      const post = buildPublishObject(publishObj);
      const res = await sdk.api.entries.postEntry(post);
      return res.createPost;
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
        //shouldn't await 'ENTRIES_KEY' as as it creates a race condition
        queryClient.invalidateQueries(ENTRIES_KEY);
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
 * pass the edited post data to the mutate function
 * @example useEditPost hook
 * ```typescript
 * const editPostQuery = useEditPost();
 *
 * editPostQuery.mutate({ entryID: 'some-entry-id', ...});
 * ```
 */
export const useEditPost = () => {
  const sdk = getSDK();
  const queryClient = useQueryClient();

  return useMutation(
    async (editedPost: IPublishData & { entryID: string }) => {
      const post = buildPublishObject(editedPost);
      const res = await sdk.api.entries.editEntry({ entryID: editedPost.entryID, ...post });
      return res.editPost;
    },
    {
      onMutate: async editedPost => {
        queryClient.setQueryData([ENTRY_KEY, editedPost.entryID], (current: PostResultFragment) => {
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
