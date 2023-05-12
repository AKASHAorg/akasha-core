import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import getSDK from '@akashaorg/awf-sdk';
import { PostResultFragment } from '@akashaorg/typings/sdk/graphql-operation-types';

import constants from './constants';
import { ENTRY_KEY } from './use-posts';
import { PROFILE_KEY } from './use-profile';
import { COMMENT_KEY } from './use-comments';
import { logError } from './utils/error-handler';
import {
  createModeration,
  getEntryModerationStatus,
  getEntryReports,
  getLogItems,
  getModeratedItems,
  getModerators,
  getModerationCounters,
  getModeratorStatus,
  getPendingItems,
} from './moderation-requests';

const {
  PENDING_CACHE_KEY_PREFIX,
  MODERATED_CACHE_KEY_PREFIX,
  MODERATION_COUNT_CACHE_KEY_PREFIX,
  LOG_ITEMS_KEY,
  KEPT_ITEMS_KEY,
  PENDING_ITEMS_KEY,
  DELISTED_ITEMS_KEY,
  CHECK_MODERATOR_KEY,
  MODERATION_ITEM_FLAGS_KEY,
  MODERATION_ITEMS_COUNT_KEY,
  LIST_MODERATORS_KEY,
} = constants;

export type UseModerationParam = {
  dataToSign: { [key: string]: string };
  contentId: string;
  contentType: string;
  url: string;
  isPending?: boolean;
};

// create moderation mutation
const createModerationMutation = async ({ dataToSign, contentId, contentType, url }) => {
  const sdk = getSDK();

  const resp = await sdk.api.auth.signData(dataToSign);
  const data = {
    contentId,
    contentType,
    data: dataToSign,
    signature: btoa(String.fromCharCode.apply(null, resp.signature)),
  };

  const response = await createModeration(url, data);

  switch (true) {
    case response.status === 409:
      throw new Error(`This content has already been moderated by you`);
    case response.status === 403:
      throw new Error('You are not authorized to perform this operation');
    case response.status >= 400:
      throw new Error('Bad request. Please try again later');
    default:
      return response;
  }
};

/**
 * Hook for creating a moderation decision
 * @example useModeration hook
 * ```typescript
 * const moderateMutation = useModeration();
 *
 * moderateMutation.mutate({ dataToSign: { explanation: 'no violations detected', ... }, contentId: 'some-content-id', contentType: 'item type', url: 'https://apiendpoint', isPending: true });
 * ```
 */
export function useModeration() {
  const queryClient = useQueryClient();
  const sdk = getSDK();
  return useMutation((param: UseModerationParam) => createModerationMutation(param), {
    onSuccess: async () => {
      // remove keys from cache
      const uiCache = sdk.services.stash.getUiStash();
      for (const key of uiCache.keys()) {
        if (
          key &&
          (key.startsWith(PENDING_CACHE_KEY_PREFIX) ||
            key.startsWith(MODERATED_CACHE_KEY_PREFIX) ||
            key.startsWith(MODERATION_COUNT_CACHE_KEY_PREFIX))
        ) {
          uiCache.delete(key);
        }
      }

      // refetch queries
      await queryClient.refetchQueries([PENDING_ITEMS_KEY]);
      await queryClient.refetchQueries([KEPT_ITEMS_KEY]);
      await queryClient.refetchQueries([DELISTED_ITEMS_KEY]);
      await queryClient.refetchQueries([MODERATION_ITEMS_COUNT_KEY]);
    },
    onError: (err: Error) => logError('[use-moderation.ts]: useModeration err', err),
  });
}

// create report mutation
const createReportMutation = async ({ dataToSign, contentId, contentType, url }) => {
  const sdk = getSDK();

  const resp = await sdk.api.auth.signData(dataToSign, true);
  const data = {
    contentId,
    contentType,
    data: dataToSign,
    signature: resp.signature.toString(),
  };

  const response = await createModeration(url, data);

  switch (true) {
    case response.status === 409:
      throw new Error(`This content has already been reported by you`);
    case response.status === 403:
      throw new Error('You are not authorized to perform this operation');
    case response.status >= 400:
      throw new Error('Bad request. Please try again later');
    default:
      return response;
  }
};

/**
 * Hook for reporting a post, reply or account
 * @example useReport hook
 * ```typescript
 * const reportMutation = useReport();
 *
 * reportMutation.mutate({ dataToSign: { explanation: 'no violations detected', ... }, contentId: 'some-content-id', contentType: 'item type', url: 'https://apiendpoint' });
 * ```
 */
export function useReport() {
  const queryClient = useQueryClient();
  return useMutation((param: UseModerationParam) => createReportMutation(param), {
    onSuccess: async (resp, variables) => {
      switch (variables.contentType) {
        case 'post':
          queryClient.setQueryData<unknown>([ENTRY_KEY, variables.contentId], prev => ({
            ...prev,
            reason: variables.dataToSign.reason,
            reported: true,
          }));
          break;
        case 'reply':
          queryClient.setQueryData<unknown>([COMMENT_KEY, variables.contentId], prev => ({
            ...prev,
            reason: variables.dataToSign.reason,
            reported: true,
          }));
          break;
        case 'account':
          queryClient.setQueryData<unknown>([PROFILE_KEY, variables.contentId], prev => ({
            ...prev,
            reason: variables.dataToSign.reason,
            reported: true,
          }));
          queryClient.setQueriesData<PostResultFragment>([ENTRY_KEY], oldData => {
            if (oldData?.author?.pubKey === variables.contentId) {
              return {
                ...oldData,
                author: { ...oldData.author, reported: true, reason: variables.dataToSign.reason },
              };
            }
            return oldData;
          });
          break;
        default:
          break;
      }
    },
    onError: (err: Error) => logError('[use-moderation.ts]: useReport err', err),
  });
}

/**
 * Utility to check entry's moderation status
 */
export const checkStatus = async (data: { user: string; contentIds: string[] }) => {
  try {
    const response = await getEntryModerationStatus(data);

    return response;
  } catch (error) {
    logError('[use-moderation.ts]: checkStatus err', error);
    throw error;
  }
};

/**
 * Hook to check if a user is a moderator
 * @example useCheckModerator hook
 * ```typescript
 * const checkModeratorQuery = useCheckModerator('logged-in-user-eth-address');
 *
 * const isModerator = checkModeratorQuery.data === 200;
 * ```
 */
export function useCheckModerator(loggedUser: string) {
  return useQuery([CHECK_MODERATOR_KEY, loggedUser], () => getModeratorStatus(loggedUser), {
    enabled: !!loggedUser,
    keepPreviousData: true,
    onError: (err: Error) => logError('[use-moderation.ts]: useCheckModerator err', err),
  });
}

/**
 * Hook to list all moderators
 * @example useGetModerators hook
 * ```typescript
 * const getModeratorsQuery = useGetModerators();
 *
 * const moderators = getModeratorsQuery.data;
 * ```
 */
export function useGetModerators() {
  return useQuery([LIST_MODERATORS_KEY], () => getModerators(), {
    keepPreviousData: true,
    onError: (err: Error) => logError('[use-moderation.ts]: useGetModerators err', err),
  });
}

/**
 * Hook to get moderation counters
 * @example useGetCount hook
 * ```typescript
 * const getCountQuery = useGetCount();
 *
 * const count = getCountQuery.data || { delisted: 0, kept: 0, pending: 0 };
 * ```
 */
export function useGetCount() {
  return useQuery([MODERATION_ITEMS_COUNT_KEY], () => getModerationCounters(), {
    initialData: { delisted: 0, kept: 0, pending: 0 },
    onError: (err: Error) => logError('[use-moderation.ts]: useGetCount err', err),
  });
}

/**
 * Hook to get report flags for a specific entry
 * @example useGetFlags hook
 * ```typescript
 * const getFlagsQuery = useGetFlags('some-entry-id');
 *
 * const flagEntries = getFlagsQuery.data;
 * ```
 */
export function useGetFlags(entryId: string) {
  return useQuery([MODERATION_ITEM_FLAGS_KEY, entryId], () => getEntryReports(entryId), {
    enabled: !!entryId,
    keepPreviousData: true,
    onError: (err: Error) => logError('[use-moderation.ts]: useGetFlags err', err),
  });
}

/**
 * Hook to get log of moderated items
 * @example useInfiniteLog hook
 * ```typescript
 * const infiniteLogQuery = useInfiniteLog(10);
 *
 * const logItemPages = React.useMemo(() => {
    if (infiniteLogQuery.data) {
      return infiniteLogQuery.data.pages;
    }
    return [];
  }, [infiniteLogQuery.data]);
 *
 * // load more items
 * const handleLoadMore = React.useCallback(() => {
    if (!infiniteLogQuery.isLoading && infiniteLogQuery.hasNextPage) {
      infiniteLogQuery.fetchNextPage();
    }
  }, [infiniteLogQuery]);
 * ```
 */
export function useInfiniteLog(limit: number, offset?: string) {
  return useInfiniteQuery(
    [LOG_ITEMS_KEY],
    async ({ pageParam = offset }) =>
      getLogItems({
        limit,
        offset: pageParam,
      }),
    {
      /* Return undefined to indicate there is no next page available. */
      getNextPageParam: lastPage => lastPage?.nextIndex || undefined,
      enabled: !!(offset || limit),
      keepPreviousData: true,
      onError: (err: Error) => logError('[use-moderation.tsx]: useInfiniteLog err', err),
    },
  );
}

/**
 * Hook to get pending moderation items
 * @example useInfinitePending hook
 * ```typescript
 * const infinitePendingQuery = useInfinitePending(10);
 *
 * const pendingItemPages = React.useMemo(() => {
    if (infinitePendingQuery.data) {
      return infinitePendingQuery.data.pages;
    }
    return [];
  }, [infinitePendingQuery.data]);
 *
 * // load more items
 * const handleLoadMore = React.useCallback(() => {
    if (!infinitePendingQuery.isLoading && infinitePendingQuery.hasNextPage) {
      infinitePendingQuery.fetchNextPage();
    }
  }, [infinitePendingQuery]);
 * ```
 */
export function useInfinitePending(limit: number, offset?: string) {
  return useInfiniteQuery(
    [PENDING_ITEMS_KEY],
    async ({ pageParam = offset }) => getPendingItems({ limit, offset: pageParam }),
    {
      /* Return undefined to indicate there is no next page available. */
      getNextPageParam: lastPage => lastPage?.nextIndex || undefined,
      enabled: !!(offset || limit),
      keepPreviousData: true,
      onError: (err: Error) => logError('[use-moderation.ts]: useInfinitePending err', err),
    },
  );
}

/**
 * Hook to get kept moderated items
 * @example useInfiniteKept hook
 * ```typescript
 * const infiniteKeptQuery = useInfiniteKept(10);
 *
 * const keptItemPages = React.useMemo(() => {
    if (infiniteKeptQuery.data) {
      return infiniteKeptQuery.data.pages;
    }
    return [];
  }, [infiniteKeptQuery.data]);
 *
 * // load more items
 * const handleLoadMore = React.useCallback(() => {
    if (!infiniteKeptQuery.isLoading && infiniteKeptQuery.hasNextPage) {
      infiniteKeptQuery.fetchNextPage();
    }
  }, [infiniteKeptQuery]);
 * ```
 */
export function useInfiniteKept(limit: number, offset?: string) {
  return useInfiniteQuery(
    [KEPT_ITEMS_KEY],
    async ({ pageParam = offset }) =>
      getModeratedItems({
        limit,
        offset: pageParam,
        delisted: false,
      }),
    {
      /* Return undefined to indicate there is no next page available. */
      getNextPageParam: lastPage => lastPage?.nextIndex || undefined,
      enabled: !!(offset || limit),
      keepPreviousData: true,
      onError: (err: Error) => logError('[use-moderation.ts]: useInfiniteKept err', err),
    },
  );
}

/**
 * Hook to get delisted moderated items
 * @example useInfiniteDelisted hook
 * ```typescript
 * const infiniteDelistedQuery = useInfiniteDelisted(10);
 *
 * const delistedItemPages = React.useMemo(() => {
    if (infiniteDelistedQuery.data) {
      return infiniteDelistedQuery.data.pages;
    }
    return [];
  }, [infiniteDelistedQuery.data]);
 *
 * // load more items
 * const handleLoadMore = React.useCallback(() => {
    if (!infiniteDelistedQuery.isLoading && infiniteDelistedQuery.hasNextPage) {
      infiniteDelistedQuery.fetchNextPage();
    }
  }, [infiniteDelistedQuery]);
 * ```
 */
export function useInfiniteDelisted(limit: number, offset?: string) {
  return useInfiniteQuery(
    [DELISTED_ITEMS_KEY],
    async ({ pageParam = offset }) =>
      getModeratedItems({
        limit,
        offset: pageParam,
        delisted: true,
      }),
    {
      /* Return undefined to indicate there is no next page available. */
      getNextPageParam: lastPage => lastPage?.nextIndex || undefined,
      enabled: !!(offset || limit),
      keepPreviousData: true,
      onError: (err: Error) => logError('[use-moderation.ts]: useInfiniteDelisted err', err),
    },
  );
}
