import { lastValueFrom } from 'rxjs';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from 'react-query';

import getSDK from '@akashaproject/awf-sdk';

import { ENTRY_KEY } from './use-posts.new';
import { PROFILE_KEY } from './use-profile.new';
import { COMMENT_KEY } from './use-comments.new';
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

export const COUNT_KEY = 'COUNT';
export const FLAGS_KEY = 'FLAGS';
export const LOG_ITEMS_KEY = 'LOG_ITEMS';
export const KEPT_ITEMS_KEY = 'KEPT_ITEMS';
export const PENDING_ITEMS_KEY = 'PENDING_ITEMS';
export const DELISTED_ITEMS_KEY = 'DELISTED_ITEMS';
export const CHECK_MODERATOR_KEY = 'CHECK_MODERATOR';
export const MODERATION_STATUS_KEY = 'MODERATION_STATUS_KEY';

export type UseModerationParam = {
  dataToSign: { [key: string]: string };
  contentId: string;
  contentType: string;
  url: string;
  modalName: string;
};

// create moderation mutation
const createModerationMutation = async ({ dataToSign, contentId, contentType, url, modalName }) => {
  const sdk = getSDK();

  try {
    const resp = await lastValueFrom(sdk.api.auth.signData(dataToSign));
    const data = {
      contentId,
      contentType,
      data: dataToSign,
      signature: btoa(String.fromCharCode.apply(null, resp.data.signature)),
    };

    const status = await createModeration(url, data);
    if (status === 409) {
      throw new Error(
        `This content has already been ${
          modalName === 'report-modal' ? 'reported' : 'moderated'
        } by you`,
      );
    } else if (status === 403) {
      throw new Error('You are not authorized to perform this operation');
    } else if (status === 400) {
      throw new Error('Bad request. Please try again later');
    } else if (status >= 400) {
      throw new Error('Unable to process your request right now. Please try again later');
    }
    return status;
  } catch (error) {
    logError('[moderation-request.tsx]: createModerationMutation err', error);
    throw error;
  }
};

function useModeration() {
  const queryClient = useQueryClient();
  return useMutation((param: UseModerationParam) => createModerationMutation(param), {
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
          queryClient.setQueriesData<unknown>(ENTRY_KEY, oldData => {
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
  });
}

// check entry moderation status
export const checkStatus = async (data: { user: string; contentIds: string[] }) => {
  try {
    const response = await getEntryModerationStatus(data);

    return response;
  } catch (error) {
    logError('[moderation-request.tsx]: checkStatus err', error);
    throw error;
  }
};

export function useModerationStatus(
  resourceId: string,
  data: {
    user: string;
    contentIds: string[];
  },
) {
  const sdk = getSDK();
  return useQuery(
    [MODERATION_STATUS_KEY, resourceId, sdk.services.stash.computeKey(data)],
    () => getEntryModerationStatus(data),
    {
      keepPreviousData: true,
      enabled: !!resourceId,
    },
  );
}

// check moderator status
const checkModerator = async (loggedUser: string) => {
  try {
    const response = await getModeratorStatus(loggedUser);
    return response;
  } catch (error) {
    logError('[moderation-request.tsx]: checkModerator err', error);
    throw error;
  }
};

export function useCheckModerator(loggedUser: string) {
  return useQuery([CHECK_MODERATOR_KEY, loggedUser], () => checkModerator(loggedUser), {
    enabled: !!loggedUser,
    keepPreviousData: true,
  });
}

// get moderation counters
const getCount = async () => {
  try {
    const response = await getModerationCounters();

    return response;
  } catch (error) {
    logError('[moderation-request.tsx]: getCount err', error);
    throw error;
  }
};

export function useGetCount() {
  return useQuery([COUNT_KEY], () => getCount(), {
    initialData: { delisted: 0, kept: 0, pending: 0 },
  });
}

// get flags per reported entry
const getFlags = async (entryId: string) => {
  try {
    const response = await getEntryReports(entryId);

    return response;
  } catch (error) {
    logError('[moderation-request.tsx]: getFlags err', error);
    throw error;
  }
};

export function useGetFlags(entryId: string) {
  return useQuery([FLAGS_KEY, entryId], () => getFlags(entryId), {
    enabled: !!entryId,
    keepPreviousData: true,
  });
}

// get transparency log items
const getLog = async (limit?: number, offset?: string) => {
  try {
    const response = await getLogItems({
      limit,
      offset,
    });

    return response;
  } catch (error) {
    logError('[moderation-request.tsx]: getLog err', error);
    throw error;
  }
};

export function useInfiniteLog(limit: number, offset?: string) {
  return useInfiniteQuery(
    LOG_ITEMS_KEY,
    async ({ pageParam = offset }) => getLog(limit, pageParam),
    {
      getNextPageParam: lastPage => lastPage.nextIndex,
      enabled: !!(offset || limit),
      keepPreviousData: true,
    },
  );
}

// get pending moderation items
const getPending = async (limit?: number, offset?: string) => {
  try {
    const response = await getPendingItems({ limit, offset });

    return response;
  } catch (error) {
    logError('[moderation-request.tsx]: getPending err', error);
    throw error;
  }
};

export function useInfinitePending(limit: number, offset?: string) {
  return useInfiniteQuery(
    PENDING_ITEMS_KEY,
    async ({ pageParam = offset }) => getPending(limit, pageParam),
    {
      getNextPageParam: lastPage => lastPage.nextIndex,
      enabled: !!(offset || limit),
      keepPreviousData: true,
    },
  );
}

// get kept moderation items
const getKept = async (limit?: number, offset?: string) => {
  try {
    const response = await getModeratedItems({
      limit,
      offset,
      delisted: false,
    });
    return response;
  } catch (error) {
    logError('[moderation-request.tsx]: getKept err', error);
    throw error;
  }
};

export function useInfiniteKept(limit: number, offset?: string) {
  return useInfiniteQuery(
    KEPT_ITEMS_KEY,
    async ({ pageParam = offset }) => getKept(limit, pageParam),
    {
      getNextPageParam: lastPage => lastPage.nextIndex,
      enabled: !!(offset || limit),
      keepPreviousData: true,
    },
  );
}

// get delisted moderation items
const getDelisted = async (limit?: number, offset?: string) => {
  try {
    const response = await getModeratedItems({
      limit,
      offset,
      delisted: true,
    });

    return response;
  } catch (error) {
    logError('[moderation-request.tsx]: getDelisted err', error);
    throw error;
  }
};

export function useInfiniteDelisted(limit: number, offset?: string) {
  return useInfiniteQuery(
    DELISTED_ITEMS_KEY,
    async ({ pageParam = offset }) => getDelisted(limit, pageParam),
    {
      getNextPageParam: lastPage => lastPage.nextIndex,
      enabled: !!(offset || limit),
      keepPreviousData: true,
    },
  );
}

export default useModeration;
