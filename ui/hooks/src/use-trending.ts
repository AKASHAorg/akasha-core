import { QueryClient, useQuery, useQueryClient } from 'react-query';
import getSDK from '@akashaorg/awf-sdk';
import { IProfileData } from '@akashaorg/typings/ui';
import { buildProfileMediaLinks } from './utils/media-utils';
import { logError } from './utils/error-handler';
import { PROFILE_KEY } from './use-profile';

export const TRENDING_TAGS_KEY = 'Trending_Tags';
export const TRENDING_PROFILES_KEY = 'Trending_Profiles';

const getTrendingTags = async () => {
  const sdk = getSDK();
  const res = await sdk.api.tags.getTrending();
  return res.searchTags;
};

/**
 * Hook to fetch trending tags
 * @example useTrendingTags hook
 * ```typescript
 * const trendingTagsQuery = useTrendingTags();
 *
 * const trendingTags = trendingTagsQuery.data;
 * ```
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
  const res = await sdk.api.profile.getTrending();
  const profiles = res.searchProfiles.map(profile => {
    const profileCache = queryClient.getQueryData<IProfileData>([PROFILE_KEY, profile?.pubKey]);
    if (profileCache) {
      return profileCache;
    }
    return buildProfileMediaLinks(profile);
  });
  return profiles || [];
};

/**
 * Hook to fetch trending profiles
 * @example useTrendingProfiles hook
 * ```typescript
 * const trendingProfilesQuery = useTrendingProfiles();
 *
 * const trendingProfiles = trendingProfilesQuery.data;
 * ```
 */
export function useTrendingProfiles() {
  const queryClient = useQueryClient();
  return useQuery([TRENDING_PROFILES_KEY], () => getTrendingProfiles(queryClient), {
    placeholderData: [],
    keepPreviousData: true,
    onError: (err: Error) => logError('useTrending.getProfiles', err),
  });
}
