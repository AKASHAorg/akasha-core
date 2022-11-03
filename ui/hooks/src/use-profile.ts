import { forkJoin, lastValueFrom } from 'rxjs';
import { QueryClient, useInfiniteQuery, useMutation, useQuery, useQueryClient } from 'react-query';

import getSDK from '@akashaorg/awf-sdk';
import { DataProviderInput } from '@akashaorg/typings/sdk';
import {
  IProfileData,
  ProfileProviderProperties,
  ProfileProviders,
  UpdateProfileStatus,
} from '@akashaorg/typings/ui';

import { checkStatus } from './use-moderation';
import { logError } from './utils/error-handler';
import { buildProfileMediaLinks } from './utils/media-utils';

/**
 * @internal
 */
export const FOLLOWERS_KEY = 'FOLLOWERS';
/**
 * @internal
 */
export const FOLLOWING_KEY = 'FOLLOWING';
/**
 * @internal
 */
export const PROFILE_KEY = 'PROFILE';
/**
 * @internal
 */
export const ENTRY_AUTHOR_KEY = 'ENTRY_AUTHOR_KEY';
/**
 * @internal
 */
export const INTERESTS_KEY = 'INTERESTS';
/**
 * @internal
 */
export const UPDATE_PROFILE_DATA_KEY = 'UPDATE_PROFILE_DATA';
/**
 * @internal
 */
export const ADD_PROFILE_PROVIDER_KEY = 'ADD_PROFILE_PROVIDER';
/**
 * @internal
 */
export const UPDATE_PROFILE_STATUS = 'UPDATE_PROFILE_STATUS';

export interface FormProfileData {
  name?: string;
  userName?: string;
  description?: string;
  avatar?: { src: { url?: string; fallbackUrl?: string }; isUrl: boolean } | null;
  coverImage?: { src: { url?: string; fallbackUrl?: string }; isUrl: boolean } | null;
  pubKey: string;
  ethAddress: string;
  socialLinks?: { type: string; value: string }[];
}
interface UpdateProfileFormData {
  profileData: FormProfileData;
  changedFields: string[];
}

interface ProfileUpdateStatus {
  status: UpdateProfileStatus;
  remainingFields: string[];
}

const getProfileData = async (payload: { pubKey: string; loggedUser?: string }) => {
  const sdk = getSDK();

  // check entry's moderation status
  const modStatus = await checkStatus({
    user: payload.loggedUser,
    contentIds: [payload.pubKey],
  });

  const res = await sdk.api.profile.getProfile(payload);
  return {
    ...buildProfileMediaLinks(res),
    ...modStatus[0],
  };
};

/**
 * Hook to get a user's profile data
 * @example useGetProfile hook
 * ```typescript
 * const getProfileQuery = useGetProfile('some-pubkey');
 *
 * const profile = getProfileQuery.data;
 * ```
 */
export function useGetProfile(pubKey: string, loggedUser?: string, enabler = true) {
  return useQuery([PROFILE_KEY, pubKey], () => getProfileData({ pubKey, loggedUser }), {
    enabled: !!pubKey && enabler,
    keepPreviousData: true,
    onError: (err: Error) => logError('useProfile.getProfileData', err),
  });
}

const getProfileDataByEthAddress = async (payload: { ethAddress: string; loggedUser?: string }) => {
  const sdk = getSDK();

  // check profile's moderation status
  const modStatus = await checkStatus({
    user: payload.loggedUser,
    contentIds: [payload.ethAddress],
  });

  const res = await sdk.api.profile.getProfile(payload);
  return {
    ...buildProfileMediaLinks(res),
    ...modStatus[0],
  };
};

/**
 * Hook to get a user's profile data
 * @example useGetProfileByEthAddress hook
 * ```typescript
 * const getProfileByEthAddressQuery = useGetProfileByEthAddress( 'some-eth-address');
 *
 * const profile = getProfileByEthAddressQuery.data;
 * ```
 */
export function useGetProfileByEthAddress(ethAddress: string, loggedUser?: string, enabler = true) {
  return useQuery(
    [PROFILE_KEY, ethAddress],
    () => getProfileDataByEthAddress({ ethAddress, loggedUser }),
    {
      enabled: !!ethAddress && enabler,
      keepPreviousData: true,
      onError: (err: Error) => logError('useProfile.getProfileData', err),
    },
  );
}

const getEntryAuthorProfileData = async (entryId: string, queryClient: QueryClient) => {
  const sdk = getSDK();
  const res = await sdk.api.entries.getEntry(entryId);
  const authorCache = queryClient.getQueryData<IProfileData>([
    PROFILE_KEY,
    res?.getPost?.author?.pubKey,
  ]);
  if (authorCache) {
    return authorCache;
  }
  return buildProfileMediaLinks(res.getPost.author);
};

/**
 * Hook to get an entry author's profile data
 * @example useGetEntryAuthor hook
 * ```typescript
 * const getEntryAuthorQuery = useGetEntryAuthor( 'some-entry-id');
 *
 * const profile = getEntryAuthorQuery.data;
 * ```
 */
export function useGetEntryAuthor(entryId: string) {
  const queryClient = useQueryClient();
  return useQuery(
    [ENTRY_AUTHOR_KEY, entryId],
    () => getEntryAuthorProfileData(entryId, queryClient),
    {
      enabled: !!entryId,
      keepPreviousData: true,
      onError: (err: Error) => logError('useProfile.getEntryAuthor', err),
    },
  );
}

const getFollowers = async (pubKey: string, limit: number, offset?: number) => {
  const sdk = getSDK();
  const res = await sdk.api.profile.getFollowers(pubKey, limit, offset);
  const followersWithMediaLinks = res.getFollowers.results.map(follower =>
    buildProfileMediaLinks(follower),
  );
  return {
    nextIndex: res.getFollowers.nextIndex,
    results: followersWithMediaLinks,
    total: res.getFollowers.total,
  };
};

/**
 * Hook to get followers for a user
 * @example useFollowers hook
 * ```typescript
 * const followersQuery = useFollowers('some-pubkey', 10);
 *
 * const followers = React.useMemo(
    () => followersQuery.data?.pages?.reduce((acc, curr) => [...acc, ...curr.results], []),
    [followersQuery.data?.pages],
  );
 * ```
 */
export function useFollowers(pubKey: string, limit: number, offset?: number) {
  return useInfiniteQuery(
    [FOLLOWERS_KEY, pubKey],
    async ({ pageParam = offset }) => getFollowers(pubKey, limit, pageParam),
    {
      /**
       * Return undefined to indicate there is no next page available.
       * https://react-query.tanstack.com/reference/useInfiniteQuery
       */
      getNextPageParam: lastPage => lastPage?.nextIndex,
      enabled: !!(offset || limit),
      keepPreviousData: true,
      onError: (err: Error) => logError('useProfile.getFollowers', err),
    },
  );
}

const getFollowing = async (pubKey: string, limit: number, offset?: number) => {
  const sdk = getSDK();
  const res = await sdk.api.profile.getFollowing(pubKey, limit, offset);
  const followingWithMediaLinks = res.getFollowing.results.map(follower =>
    buildProfileMediaLinks(follower),
  );
  return {
    nextIndex: res.getFollowing.nextIndex,
    results: followingWithMediaLinks,
    total: res.getFollowing.total,
  };
};

/**
 * Hook to get a list of profiles following the user
 * @example useFollowing hook
 * ```typescript
 * const followingQuery = useFollowing('some-pubkey', 10);
 *
 * const following = React.useMemo(
    () => followingQuery.data?.pages?.reduce((acc, curr) => [...acc, ...curr.results], []),
    [followingQuery.data?.pages],
  );
 * ```
 */
export function useFollowing(pubKey: string, limit: number, offset?: number) {
  return useInfiniteQuery(
    [FOLLOWING_KEY, pubKey],
    async ({ pageParam = offset }) => getFollowing(pubKey, limit, pageParam),
    {
      /**
       * Return undefined to indicate there is no next page available.
       * https://react-query.tanstack.com/reference/useInfiniteQuery
       */
      getNextPageParam: lastPage => lastPage?.nextIndex,
      enabled: !!(offset || limit),
      keepPreviousData: true,
      onError: (err: Error) => logError('useProfile.getFollowing', err),
    },
  );
}

const getInterests = async (pubKey: string) => {
  const sdk = getSDK();
  const res = await sdk.api.profile.getInterests(pubKey);

  const getTagCalls = res.getInterests.map(interest => {
    return sdk.api.tags.getTag(interest);
  });

  if (getTagCalls.length) {
    const tagsRes = await lastValueFrom(forkJoin(getTagCalls));

    return tagsRes.map(res => res.getTag);
  }
  return [];
};

/**
 * Fetch the list of subscribed tags for a specific pub key
 * @example useInterests hook
 * ```typescript
 * const interestsQuery = useInterests('some-pubkey');
 *
 * const interests = interestsQuery.data;
 * ```
 */
export function useInterests(pubKey: string) {
  return useQuery([INTERESTS_KEY, pubKey], () => getInterests(pubKey), {
    enabled: !!pubKey,
    keepPreviousData: true,
    onError: (err: Error) => logError('useProfile.getInterests', err),
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
    return await sdk.api.profile.saveMediaFile({ isUrl, content, name });
  } catch (error) {
    logError('useProfile.saveFile', error);
    throw error;
  }
};

const makeDefaultProvider = async (providers: DataProviderInput[]) => {
  const sdk = getSDK();
  try {
    const makeDefaultRes = await sdk.api.profile.makeDefaultProvider(providers);
    if (makeDefaultRes.hasOwnProperty('error')) {
      throw new Error(makeDefaultRes['error']);
    }
    return makeDefaultRes;
  } catch (error) {
    logError('useProfile.makeDefaultProvider', error);
    throw error;
  }
};

const saveAvatar = async (
  avatar: { isUrl: boolean; src: { url?: string; fallbackUrl?: string } },
  isRemoved: boolean,
) => {
  try {
    if (avatar && avatar.src) {
      const res = await saveMediaFile({
        isUrl: avatar.isUrl,
        content: avatar.src.url || avatar.src.fallbackUrl,
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

const saveCoverImage = async (
  coverImage: { isUrl: boolean; src: { url?: string; fallbackUrl?: string } },
  isRemoved: boolean,
) => {
  try {
    if (coverImage && coverImage.src) {
      const res = await saveMediaFile({
        isUrl: coverImage.isUrl,
        content: coverImage.src.url || coverImage.src.fallbackUrl,
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
    const res = await sdk.api.profile.registerUserName(userName);
    const userNameProvider = {
      provider: ProfileProviders.EWA_BASIC,
      property: ProfileProviderProperties.USERNAME,
      value: userName,
    };
    const addProviderRes = await sdk.api.profile.addProfileProvider([userNameProvider]);
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
  return;
};

/**
 * Hook to update a user's profile data.
 * Pass updated profile form data to the mutate function
 * @example useProfileUpdate hook
 * ```typescript
 * const profileUpdateMutation = useProfileUpdate('logged-in-user-pubkey');
 *
 * // call mutate on form submit
 * profileUpdateMutation.mutate({ profileData: { username: 'awesomeusername', ethAddress: 'logged-in-user-eth-address', ... }, changedFields: ['username', 'ethAddress'] });
 *
 * // reset mutation, if needed, for example on modal close;
 * profileUpdateMutation.reset();
 * ```
 */
export function useProfileUpdate(pubKey: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: UPDATE_PROFILE_DATA_KEY,
    mutationFn: async () => completeProfileUpdate(pubKey, queryClient),
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

        if (changedFields.includes('socialLinks')) {
          providers.push({
            provider: ProfileProviders.EWA_BASIC,
            property: ProfileProviderProperties.SOCIAL_LINKS,
            value: JSON.stringify(profileData.socialLinks),
          });
        }

        queryClient.setQueryData([UPDATE_PROFILE_STATUS, pubKey], {
          status: UpdateProfileStatus.UPDATE_IN_PROGRESS,
          remainingFields: [],
        });
        console.log('saving profile', providers);
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
    onSuccess: async () => {
      queryClient.removeQueries({
        queryKey: UPDATE_PROFILE_STATUS,
      });
      await queryClient.invalidateQueries(PROFILE_KEY);
    },
    onError: async (error, vars, context: { currentProfile: IProfileData }) => {
      queryClient.setQueryData([PROFILE_KEY, pubKey], context.currentProfile);
      queryClient.removeQueries({
        queryKey: UPDATE_PROFILE_STATUS,
      });
      logError(
        'useProfile.useProfileUpdate.onError',
        new Error(error instanceof Error ? error.message : (error as string)),
      );
    },
    onSettled: async (_data, error, variables) => {
      if (!error) {
        const { changedFields, profileData } = variables;
        if (changedFields.includes('name')) {
          queryClient.setQueryData<IProfileData>([PROFILE_KEY, pubKey], prev => ({
            ...prev,
            name: profileData.name,
          }));
        }
        if (changedFields.includes('description')) {
          queryClient.setQueryData<IProfileData>([PROFILE_KEY, pubKey], prev => ({
            ...prev,
            description: profileData.description,
          }));
        }
      }
    },
  });
}
