import { lastValueFrom } from 'rxjs';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from 'react-query';

import getSDK from '@akashaproject/awf-sdk';

import constants from './constants';
import { ENTRY_KEY } from './use-posts.new';
import { PROFILE_KEY } from './use-profile.new';
import { COMMENT_KEY } from './use-comments.new';
import { logError } from './utils/error-handler';

const { BASE_REPORT_URL, BASE_STATUS_URL, BASE_DECISION_URL, BASE_MODERATOR_URL } = constants;

export const COUNT_KEY = 'COUNT';
export const FLAGS_KEY = 'FLAGS';
export const LOG_ITEMS_KEY = 'LOG_ITEMS';
export const KEPT_ITEMS_KEY = 'MODERATED_ITEMS';
export const PENDING_ITEMS_KEY = 'PENDING_ITEMS';
export const DELISTED_ITEMS_KEY = 'MODERATED_ITEMS';
export const CHECK_MODERATOR_KEY = 'CHECK_MODERATOR';

export type UseModerationParam = {
  dataToSign: { [key: string]: string };
  contentId: string;
  contentType: string;
  url: string;
  modalName: string;
};

export const fetchRequest = async (props: {
  method: string;
  url: string;
  data?: Record<string, unknown>;
  statusOnly?: boolean;
  timeout?: number;
}) => {
  const { method, url, data = {}, statusOnly = false, timeout = 12000 } = props;
  const rheaders = new Headers();
  rheaders.append('Content-Type', 'application/json');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(url, {
    signal: controller.signal,
    method: method,
    headers: rheaders,
    ...(method === ('POST' || 'PUT' || 'PATCH') && { body: JSON.stringify(data) }),
  });

  clearTimeout(timer);

  if (method === 'HEAD' || (method === 'POST' && statusOnly)) {
    return response.status;
  }

  return response.json();
};

const handleModeration = async ({ dataToSign, contentId, contentType, url, modalName }) => {
  const sdk = getSDK();

  try {
    const resp = await lastValueFrom(sdk.api.auth.signData(dataToSign));
    const data = {
      contentId,
      contentType,
      data: dataToSign,
      signature: btoa(String.fromCharCode.apply(null, resp.data.signature)),
    };

    const status = await fetchRequest({ url, data, method: 'POST', statusOnly: true });
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
    logError('[moderation-request.tsx]: handleModeration err', error);
    throw error;
  }
};

export function useModeration() {
  const queryClient = useQueryClient();
  return useMutation((param: UseModerationParam) => handleModeration(param), {
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
          break;
        default:
          break;
      }
    },
  });
}

const checkModerator = async (loggedUser: string) => {
  try {
    const response = await fetchRequest({
      method: 'HEAD',
      url: `${BASE_MODERATOR_URL}/${loggedUser}`,
    });
    return response;
  } catch (error) {
    logError('[moderation-request.tsx]: checkModerator err', error);
    throw error;
  }
};

export function useCheckModerator(loggedUser) {
  return useQuery([CHECK_MODERATOR_KEY, loggedUser], () => checkModerator(loggedUser), {
    enabled: !!loggedUser,
    keepPreviousData: true,
  });
}

const getCount = async () => {
  try {
    const response = await fetchRequest({
      method: 'GET',
      url: `${BASE_STATUS_URL}/counters`,
    });

    return response;
  } catch (error) {
    logError('[moderation-request.tsx]: getCount err', error);
    throw error;
  }
};

export function useGetCount() {
  return useQuery([COUNT_KEY], () => getCount(), {});
}

const getFlags = async (entryId: string) => {
  try {
    const response = await fetchRequest({
      method: 'POST',
      url: `${BASE_REPORT_URL}/list/${entryId}`,
    });

    return response;
  } catch (error) {
    logError('[moderation-request.tsx]: getFlags err', error);
    throw error;
  }
};

export function useGetFlags(entryId) {
  return useQuery([FLAGS_KEY, entryId], () => getFlags(entryId), {
    enabled: !!entryId,
    keepPreviousData: true,
  });
}

const getLog = async (limit?: number, offset?: string) => {
  try {
    const response = await fetchRequest({
      method: 'POST',
      url: `${BASE_DECISION_URL}/log`,
      data: { limit, offset },
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

const getPending = async (limit?: number, offset?: string) => {
  const sdk = getSDK();
  const ipfsGateway = sdk.services.common.ipfs.getSettings().gateway;

  try {
    const response = await fetchRequest({
      method: 'POST',
      url: `${BASE_DECISION_URL}/pending`,
      data: { limit, offset },
    });

    const modResponse = response.results.map(
      (
        {
          contentType: type,
          contentID,
          reasons,
          reportedBy,
          reportedByProfile,
          reportedDate,
          reports,
        },
        idx: number,
      ) => {
        // formatting data to match labels already in use
        return {
          id: idx,
          type: type,
          entryId: contentID,
          reasons: reasons,
          reporter: reportedBy,
          reporterProfile: {
            ...reportedByProfile,
            avatar:
              reportedByProfile.avatar.length > 0
                ? `${ipfsGateway}/${reportedByProfile.avatar}`
                : null,
          },
          count: reports - 1, // minus reporter, to get count of other users
          entryDate: reportedDate,
        };
      },
    );
    return { nextIndex: response.nextIndex, results: modResponse, total: response.total };
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

const getKept = async (limit?: number, offset?: string) => {
  const sdk = getSDK();
  const ipfsGateway = sdk.services.common.ipfs.getSettings().gateway;

  try {
    // fetch delisted items
    const response = await fetchRequest({
      method: 'POST',
      url: `${BASE_DECISION_URL}/moderated`,
      data: {
        delisted: false,
        limit,
        offset,
      },
    });

    const modResponse = response.results.map(
      (
        {
          contentType: type,
          contentID,
          moderatedDate,
          explanation,
          moderator,
          moderatorProfile,
          reasons,
          reportedBy,
          reportedByProfile,
          reportedDate,
          reports,
          delisted,
        },
        idx: number,
      ) => {
        // formatting data to match labels already in use
        return {
          id: idx,
          type: type,
          entryId: contentID,
          reasons: reasons,
          description: explanation,
          reporter: reportedBy,
          reporterProfile: {
            ...reportedByProfile,
            avatar:
              reportedByProfile.avatar.length > 0
                ? `${ipfsGateway}/${reportedByProfile.avatar}`
                : null,
          },
          count: reports - 1,
          moderator: moderator,
          moderatorProfile: {
            ...moderatorProfile,
            avatar:
              moderatorProfile.avatar.length > 0
                ? `${ipfsGateway}/${moderatorProfile.avatar}`
                : null,
          },
          entryDate: reportedDate,
          evaluationDate: moderatedDate,
          delisted: delisted,
        };
      },
    );
    return { nextIndex: response.nextIndex, results: modResponse, total: response.total };
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

const getDelisted = async (limit?: number, offset?: string) => {
  const sdk = getSDK();
  const ipfsGateway = sdk.services.common.ipfs.getSettings().gateway;

  try {
    // fetch delisted items
    const response = await fetchRequest({
      method: 'POST',
      url: `${BASE_DECISION_URL}/moderated`,
      data: {
        delisted: true,
        limit,
        offset,
      },
    });

    const modResponse = response.results.map(
      (
        {
          contentType: type,
          contentID,
          moderatedDate,
          explanation,
          moderator,
          moderatorProfile,
          reasons,
          reportedBy,
          reportedByProfile,
          reportedDate,
          reports,
          delisted,
        },
        idx: number,
      ) => {
        // formatting data to match labels already in use
        return {
          id: idx,
          type: type,
          entryId: contentID,
          reasons: reasons,
          description: explanation,
          reporter: reportedBy,
          reporterProfile: {
            ...reportedByProfile,
            avatar:
              reportedByProfile.avatar.length > 0
                ? `${ipfsGateway}/${reportedByProfile.avatar}`
                : null,
          },
          count: reports - 1,
          moderator: moderator,
          moderatorProfile: {
            ...moderatorProfile,
            avatar:
              moderatorProfile.avatar.length > 0
                ? `${ipfsGateway}/${moderatorProfile.avatar}`
                : null,
          },
          entryDate: reportedDate,
          evaluationDate: moderatedDate,
          delisted: delisted,
        };
      },
    );
    return { nextIndex: response.nextIndex, results: modResponse, total: response.total };
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

export default {
  checkStatus: async (isBatch: boolean, data: Record<string, unknown>, entryId?: string) => {
    try {
      const response = await fetchRequest({
        method: 'POST',
        url: `${BASE_STATUS_URL}${!isBatch ? `/${entryId}` : ''}`,
        data: data,
      });

      return response;
    } catch (error) {
      logError('[moderation-request.tsx]: checkStatus err', error);
      throw error;
    }
  },
};
