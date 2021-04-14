import { RedisCache } from 'apollo-server-cache-redis';
import { ILRU } from './i-lru';
import { logger } from '../helpers';

export class RedisLRU implements ILRU {
  private redis: RedisCache;
  private prefix = '@lru#';

  constructor(redisInstance: RedisCache) {
    this.redis = redisInstance;
  }

  public async set(key: string, value: any) {
    try {
      const _value = JSON.stringify(value);
      return this.redis.set(`${this.prefix}${key}`, _value, { ttl: 86400 });
    } catch (e) {
      logger.warn(`error setting ${key}`);
      logger.error(e);
    }
  }

  public async has(key: string): Promise<boolean> {
    return this.redis.client.exists(`${this.prefix}${key}`);
  }

  public async get(key: string): Promise<any> {
    const _value = await this.redis.get(`${this.prefix}${key}`);
    if (!_value) {
      return undefined;
    }
    return JSON.parse(_value);
  }

  public async del(key): Promise<void> {
    await this.redis.delete(`${this.prefix}${key}`);
  }
}
