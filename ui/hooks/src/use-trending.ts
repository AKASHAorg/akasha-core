import { QueryClient, useQuery, useQueryClient } from 'react-query';
import { lastValueFrom } from 'rxjs';
import { getMediaUrl } from './utils/media-utils';
import getSDK from '@akashaproject/awf-sdk';
import { logError } from './utils/error-handler';
import { IProfileData } from '@akashaproject/ui-awf-typings/lib/profile';
import { PROFILE_KEY } from './use-profile';

export const TRENDING_TAGS_KEY = 'Trending_Tags';
export const TRENDING_PROFILES_KEY = 'Trending_Profiles';

const getTrendingTags = async () => {
  const sdk = getSDK();
  const res = await lastValueFrom(sdk.api.tags.getTrending());
  return res.data.searchTags;
};

/**
 * Hook to fetch trending tags
 */
export function useTrendingTags() {
  return useQuery([TRENDING_TAGS_KEY], () => getTrendingTags(), {
    placeholderData: [],
    keepPreviousData: true,
    onError: (err: Error) => logError('useTrending.getTags', err),
  });
}

const getTrendingProfiles = async (queryClient: QueryClient) => {
  const sdk = getSDK();
  const res = await lastValueFrom(sdk.api.profile.getTrending());
  const profiles = res.data.searchProfiles.map(profile => {
    const profileCache = queryClient.getQueryData<IProfileData>([PROFILE_KEY, profile?.pubKey]);
    if (profileCache) {
      return profileCache;
    }
    const { avatar, coverImage, ...other } = profile;
    const images: { avatar: string | null; coverImage: string | null } = {
      avatar: null,
      coverImage: null,
    };
    if (avatar) {
      images.avatar = getMediaUrl(avatar);
    }
    if (coverImage) {
      images.coverImage = getMediaUrl(coverImage);
    }
    return { ...images, ...other };
  });
  return profiles || [];
};

/**
 * Hook to fetch trending profiles
 */
export function useTrendingProfiles() {
  const queryClient = useQueryClient();
  return useQuery([TRENDING_PROFILES_KEY], () => getTrendingProfiles(queryClient), {
    placeholderData: [],
    keepPreviousData: true,
    onError: (err: Error) => logError('useTrending.getProfiles', err),
  });
}
