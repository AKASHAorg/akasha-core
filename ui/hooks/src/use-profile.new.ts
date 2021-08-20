import { useInfiniteQuery, useMutation, useQuery } from 'react-query';
import getSDK from '@akashaproject/awf-sdk';
import { lastValueFrom } from 'rxjs';
import { getMediaUrl } from './utils/media-utils';
import { logError } from './utils/error-handler';
import { DataProviderInput } from '@akashaproject/sdk-typings/lib/interfaces/common';

export const FOLLOWERS_KEY = 'FOLLOWERS';
export const FOLLOWING_KEY = 'FOLLOWING';
export const PROFILE_KEY = 'PROFILE';
export const ENTRY_AUTHOR_KEY = 'ENTRY_AUTHOR';
export const INTERESTS_KEY = 'INTERESTS';
export const UPDATE_PROFILE_DATA_KEY = 'UPDATE_PROFILE_DATA';
export const SAVE_MEDIA_FILE_KEY = 'SAVE_MEDIA_FILE';
export const REGISTER_USERNAME_KEY = 'REGISTER_USERNAME';
export const MAKE_DEFAULT_PROVIDER_KEY = 'MAKE_DEFAULT_PROVIDER';
export const ADD_PROFILE_PROVIDER_KEY = 'ADD_PROFILE_PROVIDER';

const getProfileData = async (payload: { pubKey?: string; ethAddress?: string }) => {
  const sdk = getSDK();
  try {
    const res = await lastValueFrom(sdk.api.profile.getProfile(payload));
    const { avatar, coverImage, ...other } = res.data.getProfile || res.data.resolveProfile;
    const images: { avatar: string; coverImage: string } = {
      avatar: '',
      coverImage: '',
    };
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
const updateProfileData = async (profileData: any) => {
  const sdk = getSDK();
  try {
    return Promise.resolve();
  } catch (error) {
    logError('useProfile.updateProfileData', error);
    throw error;
  }
};

const makeDefaultProvider = async (provider: DataProviderInput[]) => {
  const sdk = getSDK();
  try {
    return await lastValueFrom(sdk.api.profile.makeDefaultProvider(provider));
  } catch (error) {
    logError('useProfile.makeDefaultProvider', error);
    throw error;
  }
};

const addProfileProvider = async (provider: []) => {
  const sdk = getSDK();
  try {
    return await lastValueFrom(sdk.api.profile.addProfileProvider(provider));
  } catch (error) {
    logError('useProfile.addProfileProvider', error);
    throw error;
  }
};

export function useAddProfileProvider(provider: DataProviderInput[]) {
  return useMutation(addProfileProvider, {
    onSuccess: async () => {
      /* todo */
    },
    onError: async error => {
      throw error;
    },
    mutationKey: ADD_PROFILE_PROVIDER_KEY,
  });
}

export function useMakeDefaultProvider() {
  return useMutation({
    mutationFn: makeDefaultProvider,
    onMutate: async provider => {
      /* todo */
    },
    onSuccess: async () => {
      /* todo */
    },
    onError: async error => {
      throw error;
    },
    mutationKey: MAKE_DEFAULT_PROVIDER_KEY,
  });
}

const registerUsername = async (username: string) => {
  const sdk = getSDK();
  try {
    const res = await lastValueFrom(sdk.api.profile.registerUserName(username));
    return res.data.registerUserName;
  } catch (error) {
    logError('useProfile.registerUsername', error);
    throw error;
  }
};

export function useUsernameRegistration() {
  return useMutation(registerUsername, {
    mutationFn: registerUsername,
    onMutate: async username => {
      /* todo */
    },
    onSuccess: async () => {
      /* todo */
    },
    onError: async error => {
      throw error;
    },
    mutationKey: REGISTER_USERNAME_KEY,
  });
}

const saveFile = async ({
  isUrl,
  content,
  name,
}: {
  isUrl: boolean;
  content: string;
  name: string;
}) => {
  const sdk = getSDK();
  try {
    const res = await sdk.api.profile.saveMediaFile({ isUrl, content, name });
    return res;
  } catch (error) {
    logError('useProfile.saveFile', error);
    throw error;
  }
};

export function useSaveMediaFile() {
  return useMutation({
    mutationFn: saveFile,
    onSuccess: async () => {
      /* todo */
    },
    onError: async error => {
      throw error;
    },
    onSettled: async () => {
      /* todo */
    },
    mutationKey: SAVE_MEDIA_FILE_KEY,
  });
}
