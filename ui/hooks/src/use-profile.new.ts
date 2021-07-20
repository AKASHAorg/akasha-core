import { useInfiniteQuery } from 'react-query';
import getSDK from '@akashaproject/awf-sdk';
import { lastValueFrom } from 'rxjs';

export const FOLLOWERS_KEY = 'FOLLOWERS_KEY';
export const FOLLOWING_KEY = 'FOLLOWING_KEY';

const getFollowers = async (pubKey: string, limit: number, offset?: number) => {
  const sdk = getSDK();
  const res = await lastValueFrom(sdk.api.profile.getFollowers(pubKey, limit, offset));
  return res.data.getFollowers;
};

export function useFollowers(pubKey: string, limit: number, offset?: number) {
  return useInfiniteQuery(
    [FOLLOWERS_KEY, pubKey],
    async ({ pageParam = offset }) => getFollowers(pubKey, limit, pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage.nextIndex) {
          return undefined;
        }
        return lastPage.nextIndex;
      },
      enabled: !!(offset || limit),
      keepPreviousData: true,
    },
  );
}

const getFollowing = async (pubKey: string, limit: number, offset?: number) => {
  const sdk = getSDK();
  const res = await lastValueFrom(sdk.api.profile.getFollowing(pubKey, limit, offset));
  return res.data.getFollowing;
};

export function useFollowing(pubKey: string, limit: number, offset?: number) {
  return useInfiniteQuery(
    [FOLLOWING_KEY, pubKey],
    async ({ pageParam = offset }) => getFollowing(pubKey, limit, pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage.nextIndex) {
          return undefined;
        }
        return lastPage.nextIndex;
      },
      enabled: !!(offset || limit),
      keepPreviousData: true,
    },
  );
}
