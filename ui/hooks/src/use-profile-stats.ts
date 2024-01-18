import getSDK from '@akashaorg/awf-sdk';
import { logError } from './utils/error-handler';
import { useEffect, useState } from 'react';

const STAT_CACHE_KEY = '@statCacheKey';

const getStats = async (profileId: string) => {
  if (!profileId) return null;
  const sdk = getSDK();
  const res = await sdk.api.profile.getProfileStats(profileId);
  return res;
};

type Stats = Awaited<ReturnType<typeof getStats>>;

/**
 * Hook to get profile stats
 * @example useProfileStats hook
 * ```typescript
 * const profileStatsQuery = useProfileStats('did:pkh:eip155:5:0xadc81c169...');

 * console.log(profileStatsQuery.data)
 * ```
 */
export function useProfileStats(profileId: string, readCache?: boolean) {
  const [loading, setLoading] = useState(false);
  const [stat, setStat] = useState<Stats>(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        if (readCache) {
          const statCache = JSON.parse(localStorage.getItem(STAT_CACHE_KEY)) || {
            data: {
              totalFollowing: 0,
              totalFollowers: 0,
              totalBeams: 0,
              totalTopics: 0,
            },
          };
          setStat(statCache);
        }
        const stats = await getStats(profileId);
        setStat(stats);
        localStorage.setItem(STAT_CACHE_KEY, JSON.stringify(stats));
      } catch (err) {
        setError(err);
        logError('useProfileStats.getStats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [readCache, profileId]);

  return {
    data: stat?.data,
    loading,
    error,
  };
}
