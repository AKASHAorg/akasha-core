import LRU from 'lru-cache';
import { RedisCache } from 'apollo-server-cache-redis';
import { RedisLRU } from './redis-lru';
import { MemLRU } from './mem-lru';
import { ILRU } from './i-lru';

export const contextCache = new LRU({ max: 16000, maxAge: 1000 * 60 * 40 });
export const redisCache =
  process.env.NODE_ENV === 'production' && new RedisCache(process.env.REDIS_CONNECTION);

export const queryCache: ILRU = redisCache
  ? new RedisLRU(redisCache)
  : new MemLRU(
      new LRU({
        max: 32000,
        maxAge: 1000 * 60 * 60 * 24,
        updateAgeOnGet: true,
      }),
    );
