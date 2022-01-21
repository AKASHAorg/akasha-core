import { lastValueFrom } from 'rxjs';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from 'react-query';

import getSDK from '@akashaproject/awf-sdk';
import { Post_Response } from '@akashaproject/sdk-typings/lib/interfaces/responses';

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
  const resp = await lastValueFrom(sdk.api.auth.signData(dataToSign));
  const data = {
    contentId,
    contentType,
    data: dataToSign,
    signature: btoa(String.fromCharCode.apply(null, resp.data.signature)),
  };

  const status = await createModeration(url, data);

  switch (true) {
    case status === 409:
      throw new Error(`This content has already been moderated by you`);
    case status === 403:
      throw new Error('You are not authorized to perform this operation');
    case status >= 400:
      throw new Error('Bad request. Please try again later');
    default:
      return status;
  }
};

/**
 * Hook for creating a moderation decision
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
      await queryClient.refetchQueries(PENDING_ITEMS_KEY);
      await queryClient.refetchQueries(KEPT_ITEMS_KEY);
      await queryClient.refetchQueries(DELISTED_ITEMS_KEY);
      await queryClient.refetchQueries(MODERATION_ITEMS_COUNT_KEY);
    },
    onError: (err: Error) => logError('[use-moderation.ts]: useModeration err', err),
  });
}

// create report mutation
const createReportMutation = async ({ dataToSign, contentId, contentType, url }) => {
  const sdk = getSDK();

  const resp = await lastValueFrom(sdk.api.auth.signData(dataToSign, true));
  const data = {
    contentId,
    contentType,
    data: dataToSign,
    signature: resp.data.signature as string,
  };

  const status = await createModeration(url, data);

  switch (true) {
    case status === 409:
      throw new Error(`This content has already been reported by you`);
    case status === 403:
      throw new Error('You are not authorized to perform this operation');
    case status >= 400:
      throw new Error('Bad request. Please try again later');
    default:
      return status;
  }
};

/**
 * Hook for reporting a post, reply or account
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
          queryClient.setQueriesData<Post_Response>(ENTRY_KEY, oldData => {
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

// check entry moderation status
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
 * @param loggedUser - textile public key of the user
 */
export function useCheckModerator(loggedUser: string) {
  return useQuery([CHECK_MODERATOR_KEY, loggedUser], () => getModeratorStatus(loggedUser), {
    enabled: !!loggedUser,
    keepPreviousData: true,
    onError: (err: Error) => logError('[use-moderation.ts]: useCheckModerator err', err),
  });
}

/**
 * Hook to get moderation counters
 */
export function useGetCount() {
  return useQuery([MODERATION_ITEMS_COUNT_KEY], () => getModerationCounters(), {
    initialData: { delisted: 0, kept: 0, pending: 0 },
    onError: (err: Error) => logError('[use-moderation.ts]: useGetCount err', err),
  });
}

/**
 * Hook to get report flags for a specific entry
 * @param entryId - id of the entry
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
 * @param limit - number of items per page
 * @param offset - index of query offset
 */
export function useInfiniteLog(limit: number, offset?: string) {
  return useInfiniteQuery(
    LOG_ITEMS_KEY,
    async ({ pageParam = offset }) =>
      getLogItems({
        limit,
        offset: pageParam,
      }),
    {
      /* Return undefined to indicate there is no next page available. */
      getNextPageParam: lastPage => lastPage?.nextIndex,
      enabled: !!(offset || limit),
      keepPreviousData: true,
      onError: (err: Error) => logError('[use-moderation.tsx]: useInfiniteLog err', err),
    },
  );
}

/**
 * Hook to get pending moderation items
 * @param limit - number of items per page
 * @param offset - index of query offset
 */
export function useInfinitePending(limit: number, offset?: string) {
  return useInfiniteQuery(
    PENDING_ITEMS_KEY,
    async ({ pageParam = offset }) => getPendingItems({ limit, offset: pageParam }),
    {
      /* Return undefined to indicate there is no next page available. */
      getNextPageParam: lastPage => lastPage?.nextIndex,
      enabled: !!(offset || limit),
      keepPreviousData: true,
      onError: (err: Error) => logError('[use-moderation.ts]: useInfinitePending err', err),
    },
  );
}

/**
 * Hook to get kept moderated items
 * @param limit - number of items per page
 * @param offset - index of query offset
 */
export function useInfiniteKept(limit: number, offset?: string) {
  return useInfiniteQuery(
    KEPT_ITEMS_KEY,
    async ({ pageParam = offset }) =>
      getModeratedItems({
        limit,
        offset: pageParam,
        delisted: false,
      }),
    {
      /* Return undefined to indicate there is no next page available. */
      getNextPageParam: lastPage => lastPage?.nextIndex,
      enabled: !!(offset || limit),
      keepPreviousData: true,
      onError: (err: Error) => logError('[use-moderation.ts]: useInfiniteKept err', err),
    },
  );
}

/**
 * Hook to get delisted moderated items
 * @param limit - number of items per page
 * @param offset - index of query offset
 */
export function useInfiniteDelisted(limit: number, offset?: string) {
  return useInfiniteQuery(
    DELISTED_ITEMS_KEY,
    async ({ pageParam = offset }) =>
      getModeratedItems({
        limit,
        offset: pageParam,
        delisted: true,
      }),
    {
      /* Return undefined to indicate there is no next page available. */
      getNextPageParam: lastPage => lastPage?.nextIndex,
      enabled: !!(offset || limit),
      keepPreviousData: true,
      onError: (err: Error) => logError('[use-moderation.ts]: useInfiniteDelisted err', err),
    },
  );
}
