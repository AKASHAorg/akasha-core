import { BaseRedisCache } from 'apollo-server-cache-redis';
import { ILRU } from './i-lru';
import { logger } from '../helpers';
import { parse, stringify } from 'flatted';
import Redis from 'ioredis';

export class RedisLRU implements ILRU {
  private redis: Redis;
  private cache: BaseRedisCache;
  private prefix = '@lru#';

  constructor(redisInstance: Redis) {
    this.redis = redisInstance;
    this.cache = new BaseRedisCache({
      client: redisInstance,
    });
  }

  public async set(key: string, value: unknown, ttl = 86400) {
    try {
      const _value = stringify(value);
      return this.cache.set(`${this.prefix}${key}`, _value, { ttl: ttl });
    } catch (e) {
      logger.warn(`error setting ${key}`);
      logger.error(e);
    }
  }

  public async has(key: string): Promise<boolean> {
    return this.redis.exists(`${this.prefix}${key}`);
  }

  public async get<T>(key: string): Promise<T> {
    const _value = await this.redis.get(`${this.prefix}${key}`);
    if (!_value) {
      return undefined;
    }
    return parse(_value);
  }

  public async del(key: string): Promise<void> {
    await this.cache.delete(`${this.prefix}${key}`);
  }

  public async delete(key: string): Promise<void> {
    return this.del(key);
  }

  public async sAdd(key: string, value: string) {
    return this.redis.multi().sadd(key, value).expire(key, 86400).exec();
  }

  public async sMembers(key: string) {
    return this.redis.smembers(key);
  }

  public async sPop(key: string) {
    return this.redis.spop(key);
  }
}
