import { useMutation, useQuery, useQueryClient } from 'react-query';
import { lastValueFrom } from 'rxjs';
import getSDK from '@akashaproject/awf-sdk';
import { logError } from './utils/error-handler';

export const TAG_SUBSCRIPTIONS_KEY = 'TAG_SUBSCRIPTIONS';
export const GET_TAG_KEY = 'GET_TAG';
export const SEARCH_TAGS_KEY = 'SEARCH_TAGS';

const getTagSubscriptions = async () => {
  const sdk = getSDK();
  try {
    const res = await lastValueFrom(sdk.api.profile.getTagSubscriptions());
    return res.data.getInterests;
  } catch (error) {
    logError('useTagSubscribe.getTagSubs', error);
  }
};

export function useTagSubscriptions(loggedEthAddress: string | null) {
  return useQuery([TAG_SUBSCRIPTIONS_KEY], () => getTagSubscriptions(), {
    initialData: [],
    enabled: !!loggedEthAddress,
    keepPreviousData: false,
  });
}

const getIsSubscribedToTag = async (tagName: string) => {
  const sdk = getSDK();
  try {
    const res = await lastValueFrom(sdk.api.profile.isSubscribedToTag(tagName));
    return res.data;
  } catch (error) {
    logError('useTagSubscribe.getIsSubscribedToTag', error);
  }
};

export function useIsSubscribedToTag(tagName: string, loggedEthAddress: string | null) {
  return useQuery([TAG_SUBSCRIPTIONS_KEY, tagName], () => getIsSubscribedToTag(tagName), {
    enabled: !!loggedEthAddress,
    keepPreviousData: false,
  });
}

export function useToggleTagSubscription() {
  const sdk = getSDK();
  const queryClient = useQueryClient();
  return useMutation(tagName => lastValueFrom(sdk.api.profile.toggleTagSubscription(tagName)), {
    onMutate: async (tagName: string) => {
      await queryClient.cancelQueries(TAG_SUBSCRIPTIONS_KEY);
      const previousTagSubs: string[] = queryClient.getQueryData([TAG_SUBSCRIPTIONS_KEY]);
      let newTagsSubs = [];

      if (!previousTagSubs.includes(tagName)) {
        newTagsSubs = [...previousTagSubs, tagName];
      } else if (previousTagSubs.includes(tagName)) {
        newTagsSubs = previousTagSubs.filter(tag => tagName !== tag);
      }
      queryClient.setQueryData([TAG_SUBSCRIPTIONS_KEY], newTagsSubs);
      return { previousTagSubs };
    },
    onError: (err, variables, context) => {
      if (context?.previousTagSubs) {
        queryClient.setQueryData([TAG_SUBSCRIPTIONS_KEY], context.previousTagSubs);
      }
      logError('useTagSubscribe.toggleTagSub', err as Error);
    },
    // this is not required anymore because there is a fallback mechanism
    // onSettled: async () => {
    //   await queryClient.invalidateQueries([TAG_SUBSCRIPTIONS_KEY]);
    // },
  });
}

const getTag = async (tagName: string) => {
  const sdk = getSDK();

  const res = await lastValueFrom(sdk.api.tags.getTag(tagName));
  if (res.data.getTag) {
    return res.data.getTag;
  }
  throw new Error('Tag not found');
};
export function useGetTag(tagName: string, enabler = true) {
  return useQuery([GET_TAG_KEY, tagName], () => getTag(tagName), {
    enabled: !!tagName && enabler,
  });
}

const getTags = async tagName => {
  const sdk = getSDK();
  const res = await lastValueFrom(sdk.api.tags.searchTags(tagName));
  if (res.hasOwnProperty('errors')) {
    throw new Error(res['errors'][0]);
  }
  return res.data.searchTags;
};

export function useTagSearch(tagName: string) {
  return useQuery([SEARCH_TAGS_KEY, tagName], () => getTags(tagName), {
    enabled: !!tagName,
    keepPreviousData: true,
  });
}
