import { useInfiniteQuery, useQuery } from 'react-query';
import getSDK from '@akashaproject/awf-sdk';
import { lastValueFrom } from 'rxjs';
import { getMediaUrl } from './utils/media-utils';
import { logError } from './utils/error-handler';

export const FOLLOWERS_KEY = 'FOLLOWERS';
export const FOLLOWING_KEY = 'FOLLOWING';
export const PROFILE_KEY = 'PROFILE';
export const ENTRY_AUTHOR_KEY = 'ENTRY_AUTHOR';
export const INTERESTS_KEY = 'INTERESTS';

const getProfileData = async (payload: { pubKey?: string; ethAddress?: string }) => {
  const sdk = getSDK();
  try {
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
  } catch (error) {
    logError('useProfile.getProfileData', error);
  }
};

export function useGetProfile(pubKey?: string, ethAddress?: string) {
  const secondKey = pubKey || ethAddress;
  return useQuery([PROFILE_KEY, secondKey], () => getProfileData({ pubKey, ethAddress }), {
    enabled: !!(pubKey || ethAddress),
    keepPreviousData: true,
  });
}

const getEntryAuthorProfileData = async (entryId: string) => {
  const sdk = getSDK();
  try {
    const res = await lastValueFrom(sdk.api.entries.getEntry(entryId));
    const { avatar, coverImage, ...other } = res.data.getPost.author;
    const images: { avatar?: string; coverImage?: string } = {};
    if (avatar) {
      images.avatar = getMediaUrl(avatar);
    }
    if (coverImage) {
      images.coverImage = getMediaUrl(coverImage);
    }
    return { ...images, ...other };
  } catch (error) {
    logError('useProfile.getEntryAuthor', error);
  }
};

export function useGetEntryAuthor(entryId: string) {
  return useQuery([ENTRY_AUTHOR_KEY, entryId], () => getEntryAuthorProfileData(entryId), {
    enabled: !!entryId,
    keepPreviousData: true,
  });
}

const getFollowers = async (pubKey: string, limit: number, offset?: number) => {
  const sdk = getSDK();
  try {
    const res = await lastValueFrom(sdk.api.profile.getFollowers(pubKey, limit, offset));
    return res.data.getFollowers;
  } catch (error) {
    logError('useProfile.getFollowers', error);
  }
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
  try {
    const res = await lastValueFrom(sdk.api.profile.getFollowing(pubKey, limit, offset));
    return res.data.getFollowing;
  } catch (error) {
    logError('useProfile.getFollowing', error);
  }
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

const getInterests = async (pubKey: string) => {
  const sdk = getSDK();
  try {
    const res = await lastValueFrom(sdk.api.profile.getInterests(pubKey));
    return res.data.getInterests;
  } catch (error) {
    logError('useProfile.getInterests', error);
  }
};

/**
 * Fetch the list of subscribed tags for a specific pub key
 * @param pubKey
 */
export function useInterests(pubKey) {
  return useQuery([INTERESTS_KEY, pubKey], () => getInterests(pubKey), {
    enabled: !!pubKey,
    keepPreviousData: true,
  });
}
