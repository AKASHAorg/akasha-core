import { useQuery } from '@tanstack/react-query';
import getSDK from '@akashaorg/awf-sdk';
import { logError } from './utils/error-handler';

export const PROFILE_STATS_QUERY_KEY = 'Profile_Stats';

const getStats = async (profileId: string) => {
  const sdk = getSDK();

  const res = await sdk.api.profile.getProfileStats(profileId);
  return res;
};

/**
 * Hook to get profile stats
 *
 * ```typescript
 * const profileStatsQuery = useProfileStats('did:pkh:eip155:5:0xadc81c169...');

 * console.log(profileStatsQuery.data)
 * ```
 */
export function useProfileStats(profileId: string) {
  return useQuery([`${PROFILE_STATS_QUERY_KEY}_${profileId}`], () => getStats(profileId), {
    enabled: !!profileId,
    keepPreviousData: true,
    initialData: {
      data: {
        totalFollowing: 0,
        totalFollowers: 0,
        totalBeams: 0,
        totalTopics: 0,
      },
    },
    onError: (err: Error) => logError('useProfileStats.getStats', err),
  });
}
