import { ILRU } from './i-lru';
import { logger } from '../helpers';
import { parse, stringify } from 'flatted';
import Redis from 'ioredis';

export class RedisLRU implements ILRU {
  private redis: Redis;
  private prefix = '@lru#';

  constructor(redisInstance: Redis) {
    this.redis = redisInstance;
  }

  public async set(key: string, value: unknown, ttl = 86400) {
    try {
      const _value = stringify(value);
      return this.redis.set(`${this.prefix}${key}`, _value, 'EX', ttl);
    } catch (e) {
      logger.warn(`error setting ${key}`);
      logger.error(e);
    }
  }

  public async has(key: string): Promise<boolean> {
    const occurrence = await this.redis.exists(`${this.prefix}${key}`);
    return occurrence > 0;
  }

  public async get<T>(key: string): Promise<T> {
    const _value = await this.redis.get(`${this.prefix}${key}`);
    if (!_value) {
      return undefined;
    }
    logger.info(`cache hit for ${key}`);
    return parse(_value);
  }

  public async del(key: string): Promise<void> {
    await this.redis.del(`${this.prefix}${key}`);
  }

  public async delete(key: string): Promise<void> {
    return this.del(key);
  }

  public async sAdd(key: string, value: string) {
    await this.redis.multi().sadd(key, value).expire(key, 86400).exec();
    return;
  }

  public async sMembers(key: string) {
    return this.redis.smembers(key);
  }

  public async sPop(key: string) {
    return this.redis.spop(key);
  }
}
