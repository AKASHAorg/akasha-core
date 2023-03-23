import { useMutation, useQuery, useQueryClient } from 'react-query';
import getSDK from '@akashaorg/awf-sdk';
import { IProfileData } from '@akashaorg/typings/ui';
import { logError } from './utils/error-handler';
import { PROFILE_KEY } from './use-profile';

export const TAG_SUBSCRIPTIONS_KEY = 'TAG_SUBSCRIPTIONS';
export const GET_TAG_KEY = 'GET_TAG';
export const SEARCH_TAGS_KEY = 'SEARCH_TAGS';

const getTagSubscriptions = async () => {
  const sdk = getSDK();
  const res = await sdk.api.profile.getTagSubscriptions();
  return res.data.getInterests;
};

/**
 * Hook to get a user's subscribed tags
 * @example useTagSubscriptions hook
 * ```typescript
 * const subscribedTagsQuery = useTagSubscriptions('logged-in-user-eth-address');
 *
 * const subscribedTags = subscribedTagsQuery.data;
 * ```
 */
export function useTagSubscriptions(loggedEthAddress: string | null) {
  return useQuery([TAG_SUBSCRIPTIONS_KEY], () => getTagSubscriptions(), {
    initialData: [],
    enabled: !!loggedEthAddress,
    keepPreviousData: false,
    onError: (err: Error) => logError('useTagSubscribe.getTagSubs', err),
  });
}

const getIsSubscribedToTag = async (tagName: string) => {
  const sdk = getSDK();
  return sdk.api.profile.isSubscribedToTag(tagName);
};

/**
 * Hook to check if a user is subscribed to a tag
 * @example useIsSubscribedToTag hook
 * ```typescript
 * const isSubscribedToTagQuery = useIsSubscribedToTag('awesome tag', 'logged-in-user-eth-address');
 *
 * const isSubscribedToTag = isSubscribedToTagQuery.data;
 * ```
 */
export function useIsSubscribedToTag(tagName: string, loggedEthAddress: string | null) {
  return useQuery([TAG_SUBSCRIPTIONS_KEY, tagName], () => getIsSubscribedToTag(tagName), {
    enabled: !!loggedEthAddress,
    keepPreviousData: false,
    onError: (err: Error) => logError('useTagSubscribe.getIsSubscribedToTag', err),
  });
}

/**
 * Hook to toggle a user's tag subscription.
 * Pass the tagName to the mutate function
 * @example useToggleTagSubscription hook
 * ```typescript
 * const toggleTagSubscriptionQuery = useToggleTagSubscription();
 *
 * toggleTagSubscriptionQuery.mutate('awesome tag');
 * ```
 */
export function useToggleTagSubscription() {
  const sdk = getSDK();
  const queryClient = useQueryClient();
  return useMutation(tagName => sdk.api.profile.toggleTagSubscription(tagName), {
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
    onSuccess: async data => {
      const user = await sdk.api.auth.getCurrentUser();
      const ownPubKey = user.pubKey;
      if (user) {
        queryClient.setQueryData<IProfileData>([PROFILE_KEY, ownPubKey], profile => {
          const interestCount = profile.totalInterests;
          const operation = data?.toggleInterestSub ? +1 : -1;
          let totalInterests: number;
          if (typeof interestCount === 'number') {
            totalInterests = Math.max(0, interestCount + operation);
          } else {
            totalInterests = Math.max(0, parseInt(interestCount, 10) + operation);
          }
          return {
            ...profile,
            totalInterests,
          };
        });
      }
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

  const res = await sdk.api.tags.getTag(tagName);

  if (res.data.getTag) {
    return res.data.getTag;
  }
  throw new Error('Tag not found');
};

/**
 * Hook to get a specific tag by name
 * @example useGetTag hook
 * ```typescript
 * const getTagQuery = useGetTag('awesometag', true);
 *
 * const tag =  getTagQuery.data
 * ```
 */
export function useGetTag(tagName: string, enabler = true) {
  return useQuery([GET_TAG_KEY, tagName], () => getTag(tagName), {
    enabled: !!tagName && enabler,
    onError: (err: Error) => logError('useTag.useGetTag', err),
  });
}

const getTags = async tagName => {
  const sdk = getSDK();
  const res = await sdk.api.tags.searchTags(tagName);
  if (res.hasOwnProperty('errors')) {
    throw new Error(res['errors'][0]);
  }
  return res.searchTags;
};

/**
 * Hook to search for tags
 * @example useTagSearch hook
 * ```typescript
 * const tagSearchQuery = useTagSearch('awesometag');
 *
 * const result =  tagSearchQuery.data
 * ```
 */
export function useTagSearch(tagName: string) {
  return useQuery([SEARCH_TAGS_KEY, tagName], () => getTags(tagName), {
    enabled: !!tagName,
    keepPreviousData: true,
    onError: (err: Error) => logError('useTag.useTagSearch', err),
  });
}
