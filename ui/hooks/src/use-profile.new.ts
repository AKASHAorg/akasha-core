import { QueryClient, useInfiniteQuery, useMutation, useQuery, useQueryClient } from 'react-query';
import getSDK from '@akashaproject/awf-sdk';
import { forkJoin, lastValueFrom } from 'rxjs';
import { DataProviderInput } from '@akashaproject/sdk-typings/lib/interfaces/common';

import moderationRequest from './moderation-request';
import { getMediaUrl } from './utils/media-utils';
import { logError } from './utils/error-handler';
import {
  IProfileData,
  ProfileProviderProperties,
  ProfileProviders,
  UpdateProfileStatus,
} from '@akashaproject/ui-awf-typings/lib/profile';

export const FOLLOWERS_KEY = 'FOLLOWERS';
export const FOLLOWING_KEY = 'FOLLOWING';
export const PROFILE_KEY = 'PROFILE';
export const ENTRY_AUTHOR_KEY = 'ENTRY_AUTHOR';
export const INTERESTS_KEY = 'INTERESTS';
export const UPDATE_PROFILE_DATA_KEY = 'UPDATE_PROFILE_DATA';
export const ADD_PROFILE_PROVIDER_KEY = 'ADD_PROFILE_PROVIDER';
export const UPDATE_PROFILE_STATUS = 'UPDATE_PROFILE_STATUS';

const getProfileData = async (payload: {
  pubKey: string;
  loggedUser?: string;
}): Promise<IProfileData> => {
  const sdk = getSDK();

  try {
    // check entry's moderation status
    const modStatus = await moderationRequest.checkStatus(true, {
      user: payload.loggedUser,
      contentIds: [payload.pubKey],
    });

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

    return { ...images, ...other, ...modStatus[0] };
  } catch (error) {
    logError('useProfile.getProfileData', error);
  }
};

export function useGetProfile(pubKey: string, loggedUser?: string, enabler = true) {
  return useQuery([PROFILE_KEY, pubKey], () => getProfileData({ pubKey, loggedUser }), {
    enabled: !!(pubKey && enabler),
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
      getNextPageParam: lastPage => {
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
      getNextPageParam: lastPage => {
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

    const getTagCalls = res.data.getInterests.map(interest => {
      return sdk.api.tags.getTag(interest);
    });

    if (getTagCalls.length) {
      const tagsRes = await lastValueFrom(forkJoin(getTagCalls));

      return tagsRes.map(res => res.data.getTag);
    }
    return [];
  } catch (error) {
    logError('useProfile.getInterests', error);
  }
};

/**
 * Fetch the list of subscribed tags for a specific pub key
 * @param pubKey - the pub key of the user
 */
export function useInterests(pubKey) {
  return useQuery([INTERESTS_KEY, pubKey], () => getInterests(pubKey), {
    enabled: !!pubKey,
    keepPreviousData: true,
  });
}

const saveMediaFile = async ({
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

export interface FormProfileData {
  name?: string;
  userName?: string;
  description?: string;
  avatar?: { src: string; isUrl: boolean } | null;
  coverImage?: { src: string; isUrl: boolean } | null;
  pubKey: string;
  ethAddress: string;
}
interface UpdateProfileFormData {
  profileData: FormProfileData;
  changedFields: string[];
}

interface ProfileUpdateStatus {
  status: UpdateProfileStatus;
  remainingFields: string[];
}

const makeDefaultProvider = async (providers: DataProviderInput[]) => {
  const sdk = getSDK();
  try {
    const makeDefaultRes = await lastValueFrom(sdk.api.profile.makeDefaultProvider(providers));
    if (makeDefaultRes.hasOwnProperty('error')) {
      throw new Error(makeDefaultRes['error']);
    }
    return makeDefaultRes;
  } catch (error) {
    logError('useProfile.makeDefaultProvider', error);
    throw error;
  }
};

const saveAvatar = async (avatar: { isUrl: boolean; src: string }, isRemoved: boolean) => {
  try {
    if (avatar && avatar.src) {
      const res = await saveMediaFile({
        isUrl: avatar.isUrl,
        content: avatar.src,
        name: ProfileProviderProperties.AVATAR,
      });
      return {
        provider: ProfileProviders.EWA_BASIC,
        property: ProfileProviderProperties.AVATAR,
        value: res.CID,
      };
    } else if (isRemoved) {
      return {
        provider: ProfileProviders.EWA_BASIC,
        property: ProfileProviderProperties.AVATAR,
        value: '',
      };
    }
  } catch (error) {
    logError('useProfile.saveAvatar', error);
    throw error;
  }
};

const saveCoverImage = async (coverImage: { isUrl: boolean; src: string }, isRemoved: boolean) => {
  try {
    if (coverImage && coverImage.src) {
      const res = await saveMediaFile({
        isUrl: coverImage.isUrl,
        content: coverImage.src,
        name: ProfileProviderProperties.COVER_IMAGE,
      });
      return {
        provider: ProfileProviders.EWA_BASIC,
        property: ProfileProviderProperties.COVER_IMAGE,
        value: res.CID,
      };
    } else if (isRemoved) {
      return {
        provider: ProfileProviders.EWA_BASIC,
        property: ProfileProviderProperties.COVER_IMAGE,
        value: '',
      };
    }
  } catch (error) {
    logError('useProfile.saveCoverImage', error);
    throw error;
  }
};

const saveUserName = async (userName: string) => {
  const sdk = getSDK();
  try {
    const res = await lastValueFrom(sdk.api.profile.registerUserName(userName));
    const userNameProvider = {
      provider: ProfileProviders.EWA_BASIC,
      property: ProfileProviderProperties.USERNAME,
      value: userName,
    };
    const addProviderRes = await lastValueFrom(
      sdk.api.profile.addProfileProvider([userNameProvider]),
    );
    if (res.hasOwnProperty('error')) {
      throw new Error(res['error']);
    }
    if (addProviderRes.hasOwnProperty('error')) {
      throw new Error(addProviderRes['error']);
    }

    return userNameProvider;
  } catch (error) {
    logError('useProfile.registerUsername', error);
    throw error;
  }
};

const completeProfileUpdate = async (pubKey: string, queryClient: QueryClient) => {
  queryClient.setQueryData<ProfileUpdateStatus>([UPDATE_PROFILE_STATUS, pubKey], {
    status: UpdateProfileStatus.UPDATE_COMPLETE,
    remainingFields: [],
  });
};

export function useProfileUpdate(pubKey: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => await completeProfileUpdate(pubKey, queryClient),
    onMutate: async (formData: UpdateProfileFormData) => {
      const currentProfile = queryClient.getQueryData<IProfileData>([PROFILE_KEY, pubKey]);
      const { profileData, changedFields } = formData;
      queryClient.setQueryData<ProfileUpdateStatus>([UPDATE_PROFILE_STATUS, pubKey], {
        status: UpdateProfileStatus.UPDATE_INITIATED,
        remainingFields: changedFields,
      });

      const providers = [];
      try {
        if (changedFields.includes('avatar')) {
          // save avatar
          queryClient.setQueryData<ProfileUpdateStatus>([UPDATE_PROFILE_STATUS, pubKey], {
            status: UpdateProfileStatus.UPLOADING_AVATAR,
            remainingFields: changedFields,
          });
          providers.push(await saveAvatar(profileData.avatar, profileData.avatar === null));
        }

        if (changedFields.includes('coverImage')) {
          queryClient.setQueryData<ProfileUpdateStatus>([UPDATE_PROFILE_STATUS, pubKey], {
            status: UpdateProfileStatus.UPLOADING_COVER_IMAGE,
            remainingFields: changedFields,
          });
          providers.push(
            await saveCoverImage(profileData.coverImage, profileData.coverImage === null),
          );
        }
        queryClient.setQueryData<ProfileUpdateStatus>([UPDATE_PROFILE_STATUS, pubKey], {
          status: UpdateProfileStatus.UPDATE_IN_PROGRESS,
          remainingFields: changedFields.filter(
            field => field !== 'avatar' && field !== 'coverImage',
          ),
        });

        if (changedFields.includes('userName')) {
          providers.push(await saveUserName(profileData.userName));
        }
        if (changedFields.includes('name')) {
          providers.push({
            provider: ProfileProviders.EWA_BASIC,
            property: ProfileProviderProperties.NAME,
            value: profileData.name,
          });
        }
        if (changedFields.includes('description')) {
          providers.push({
            provider: ProfileProviders.EWA_BASIC,
            property: ProfileProviderProperties.DESCRIPTION,
            value: profileData.description,
          });
        }

        queryClient.setQueryData([UPDATE_PROFILE_STATUS, pubKey], {
          status: UpdateProfileStatus.UPDATE_IN_PROGRESS,
          remainingFields: [],
        });

        const makeDefaultRes = await makeDefaultProvider(providers);
        if (makeDefaultRes.hasOwnProperty('error')) {
          throw new Error(makeDefaultRes['error']);
        }
        return Promise.resolve({ currentProfile });
      } catch (err) {
        // do not throw error here, just log it
        logError('useProfile.useProfileUpdate.onMutate', err);
      }
    },
    onSuccess: async (providers, variables) => {
      /* todo */
      queryClient.invalidateQueries([PROFILE_KEY, pubKey]);
      queryClient.invalidateQueries([PROFILE_KEY, variables.profileData.ethAddress]);
      queryClient.removeQueries({
        queryKey: [UPDATE_PROFILE_STATUS, pubKey],
      });
    },
    onError: async (error, vars, context: { currentProfile: IProfileData }) => {
      queryClient.setQueryData([PROFILE_KEY, pubKey], context.currentProfile);
      queryClient.removeQueries({
        queryKey: [UPDATE_PROFILE_STATUS, pubKey],
      });
      logError(
        'useProfile.useProfileUpdate.onError',
        new Error(error instanceof Error ? error.message : (error as string)),
      );
    },
    mutationKey: UPDATE_PROFILE_DATA_KEY,
  });
}
