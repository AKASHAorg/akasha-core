import { QueryClient, useQuery, useQueryClient } from 'react-query';
import { lastValueFrom } from 'rxjs';
import getSDK from '@akashaorg/awf-sdk';
import { getMediaUrl } from './utils/media-utils';
import { IProfileData } from '@akashaorg/ui-awf-typings/lib/profile';
import { PROFILE_KEY } from './use-profile';
import { logError } from './utils/error-handler';

export const MENTION_SEARCH_KEY = 'MENTION_SEARCH_KEY';

const getMentions = async (mention: string, queryClient: QueryClient) => {
  const sdk = getSDK();
  const res = await lastValueFrom(sdk.api.profile.searchProfiles(mention));
  return res.data.searchProfiles.map(profileResp => {
    const authorCache = queryClient.getQueryData<IProfileData>([PROFILE_KEY, profileResp?.pubKey]);
    if (authorCache) {
      return authorCache;
    }
    const { avatar, coverImage, ...other } = profileResp;
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
};

/**
 * Hook to search for profiles
 * @param mention - profile name to search for
 */
export function useMentionSearch(mention: string) {
  const queryClient = useQueryClient();
  return useQuery([MENTION_SEARCH_KEY, mention], () => getMentions(mention, queryClient), {
    enabled: !!mention,
    keepPreviousData: true,
    onError: (err: Error) => logError('useMentionSearch', err),
  });
}
