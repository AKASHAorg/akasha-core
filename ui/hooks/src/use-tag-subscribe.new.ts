import { useMutation, useQuery, useQueryClient } from 'react-query';
import { lastValueFrom } from 'rxjs';
import getSDK from '@akashaproject/awf-sdk';
import { logError } from './utils/error-handler';
import { IAkashaError } from '@akashaproject/ui-awf-typings';

export const TAG_SUBSCRIPTIONS_KEY = 'Tag_Subscriptions';

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
    keepPreviousData: true,
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
    keepPreviousData: true,
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
    // onSuccess: async (data, variables, context) => {
    //   const previousTagSubs: any = queryClient.getQueryData([TAG_SUBSCRIPTIONS_KEY]);
    //   const res = await lastValueFrom(sdk.api.profile.getTagSubscriptions());
    //   const subs = Object.entries(res.data)
    //     .filter(el => el[1])
    //     .map(el => el[0]);

    //   await queryClient.setQueryData([TAG_SUBSCRIPTIONS_KEY], subs);
    // },
    onSettled: async () => {
      await queryClient.invalidateQueries([TAG_SUBSCRIPTIONS_KEY]);
    },
  });
}
