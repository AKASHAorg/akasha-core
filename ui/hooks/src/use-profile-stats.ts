import getSDK from '@akashaorg/awf-sdk';
import { logError } from './utils/error-handler';
import { useEffect, useState } from 'react';

const PROFILE_STATS_QUERY_KEY = 'Profile_Stats';

const getStats = async (profileId: string) => {
  if (!profileId) return null;

  const sdk = getSDK();

  const res = await sdk.api.profile.getProfileStats(profileId);
  return res;
};

type Stats = Awaited<ReturnType<typeof getStats>>;

/**
 * Hook to get profile stats
 *
 * ```typescript
 * const profileStatsQuery = useProfileStats('did:pkh:eip155:5:0xadc81c169...');

 * console.log(profileStatsQuery.data)
 * ```
 */
export function useProfileStats(profileId: string) {
  const [loading, setLoading] = useState(false);
  const [stat, setStat] = useState<Stats>(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        setStat(await getStats(profileId));
      } catch (err) {
        setError(err);
        logError('useProfileStats.getStats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [profileId]);

  return {
    data: stat?.data,
    loading,
    error,
  };
}

useProfileStats.getKey = (profileId: string) => [`${PROFILE_STATS_QUERY_KEY}_${profileId}`];
