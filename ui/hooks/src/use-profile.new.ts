import { useInfiniteQuery, useQuery } from 'react-query';
import getSDK from '@akashaproject/awf-sdk';
import { lastValueFrom } from 'rxjs';
import { getMediaUrl } from './utils/media-utils';

export const FOLLOWERS_KEY = 'FOLLOWERS_KEY';
export const FOLLOWING_KEY = 'FOLLOWING_KEY';
export const PROFILE_KEY = 'PROFILE';

const getProfileData = async (payload: { pubKey?: string; ethAddress?: string }) => {
  const sdk = getSDK();
  const res = await lastValueFrom(sdk.api.profile.getProfile(payload));
  const { avatar, coverImage, ...other } = res.data.getProfile || res.data.resolveProfile;
  const images: { avatar?: string; coverImage?: string } = {};
  if (avatar) {
    images.avatar = getMediaUrl(avatar);
  }
  if (coverImage) {
    images.coverImage = getMediaUrl(coverImage);
  }
  return { ...images, ...other };
};

export function useGetProfile(pubKey?: string, ethAddress?: string) {
  const secondKey = pubKey || ethAddress;
  return useQuery([PROFILE_KEY, secondKey], () => getProfileData({ pubKey, ethAddress }), {
    enabled: !!(pubKey || ethAddress),
    keepPreviousData: true,
  });
}

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
