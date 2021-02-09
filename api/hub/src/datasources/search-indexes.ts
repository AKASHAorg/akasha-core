import algoliasearch from 'algoliasearch';
import { AuthMode } from '@algolia/client-common';
import { createInMemoryCache } from '@algolia/cache-in-memory';
import { createFallbackableCache } from '@algolia/cache-common';
import { LogLevelEnum } from '@algolia/logger-common';
import { createConsoleLogger } from '@algolia/logger-console';

const client = algoliasearch(process.env.AWF_SEARCH_ID, process.env.AWF_SEARCH_KEY, {
  authMode: AuthMode.WithinHeaders,
  responsesCache: createInMemoryCache(),
  requestsCache: createInMemoryCache({ serializable: false }),
  hostsCache: createFallbackableCache({
    caches: [createInMemoryCache()],
  }),
  logger: createConsoleLogger(LogLevelEnum.Error),
});
export const searchIndex = client.initIndex(process.env.AWF_SEARCH_INDEX);
