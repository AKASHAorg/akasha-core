import { QueryClient, useQuery, useQueryClient } from 'react-query';
import { lastValueFrom } from 'rxjs';
import getSDK from '@akashaorg/awf-sdk';
import { IProfileData } from '@akashaorg/typings/ui';
import { buildProfileMediaLinks } from './utils/media-utils';
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
    return buildProfileMediaLinks(profileResp);
  });
};

/**
 * Hook to search for profiles
 * @example useMentionSearch hook
 * ```typescript
 * const mentionQuery = useMentionSearch('awesomemention');
 *
 * const mentions = mentionQuery.data;
 * ```
 */
export function useMentionSearch(mention: string) {
  const queryClient = useQueryClient();
  return useQuery([MENTION_SEARCH_KEY, mention], () => getMentions(mention, queryClient), {
    enabled: !!mention,
    keepPreviousData: true,
    onError: (err: Error) => logError('useMentionSearch', err),
  });
}
