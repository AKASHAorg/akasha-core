import LRU from 'lru-cache';
import { RedisLRU } from './redis-lru';
import { MemLRU } from './mem-lru';
import { ILRU } from './i-lru';
import Keyv from 'keyv';
import KeyvRedis from '@keyv/redis';
import Redis from 'ioredis';
import { KeyvAdapter } from '@apollo/utils.keyvadapter';

export const contextCache = new LRU({ max: 16000, ttl: 1000 * 60 * 40 });
export const redisConn =
  process.env.NODE_ENV === 'production' && new Redis(process.env.REDIS_CONNECTION);

const keyvRedis = redisConn && new KeyvRedis(redisConn);
const keyv = keyvRedis && new Keyv({ store: keyvRedis });
export const redisCache = keyv && new KeyvAdapter(keyv);

export const queryCache: ILRU = redisConn
  ? new RedisLRU(redisConn)
  : new MemLRU(
      new LRU({
        max: 32000,
        ttl: 1000 * 60 * 60 * 24,
        updateAgeOnGet: true,
      }),
    );

export const registryCache: ILRU = redisConn
  ? new RedisLRU(redisConn)
  : new MemLRU(
      new LRU({
        max: 12000,
        ttl: 1000 * 60 * 60,
      }),
    );
