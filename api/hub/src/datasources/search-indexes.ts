import algoliasearch from 'algoliasearch';
import { AuthMode } from '@algolia/client-common';
import { createInMemoryCache } from '@algolia/cache-in-memory';
import { createFallbackableCache } from '@algolia/cache-common';
import { LogLevelEnum } from '@algolia/logger-common';
import { createConsoleLogger } from '@algolia/logger-console';
import { logger } from '../helpers';

const responsesCache = createInMemoryCache();
const requestsCache = createInMemoryCache({ serializable: false });
const hostsCache = createFallbackableCache({
  caches: [createInMemoryCache()],
});

export const clearCacheInterval = setInterval(async () => {
  await responsesCache.clear();
  await requestsCache.clear();
  await hostsCache.clear();
  logger.info('cleared algolia search cache');
}, 1000 * 60 * 30);

const client = algoliasearch(process.env.AWF_SEARCH_ID, process.env.AWF_SEARCH_KEY, {
  authMode: AuthMode.WithinHeaders,
  responsesCache: responsesCache,
  requestsCache: requestsCache,
  hostsCache: hostsCache,
  logger: createConsoleLogger(LogLevelEnum.Error),
});
export const searchIndex = client.initIndex(process.env.AWF_SEARCH_INDEX);
