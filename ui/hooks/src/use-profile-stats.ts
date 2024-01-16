import getSDK from '@akashaorg/awf-sdk';
import { logError } from './utils/error-handler';
import { useEffect, useState } from 'react';

const STAT_CACHE_KEY = '@statCacheKey';

/**
 * Utility to fetch profile stats and cache data for prefetching
 * @example getStats
 * ```typescript
 * const profileStats = getStats('did:pkh:eip155:5:0xadc81c169...');

 * console.log(profileStatsQuery.data)
 * ```
 */
export const getStats = async (profileId: string) => {
  if (!profileId) return null;
  const sdk = getSDK();
  const res = await sdk.api.profile.getProfileStats(profileId);
  localStorage.setItem(STAT_CACHE_KEY, JSON.stringify(res));
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
export function useProfileStats(profileId: string, cacheOnly?: boolean) {
  const [loading, setLoading] = useState(false);
  const [stat, setStat] = useState<Stats>(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        if (cacheOnly) {
          const statsCache = JSON.parse(localStorage.getItem(STAT_CACHE_KEY)) || null;
          setStat(statsCache);
        } else {
          setStat(await getStats(profileId));
        }
      } catch (err) {
        setError(err);
        logError('useProfileStats.getStats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [cacheOnly, profileId]);

  return {
    data: stat?.data,
    loading,
    error,
  };
}
