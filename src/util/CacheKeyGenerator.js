import redis from '../config/redis.js';
import { logger } from './logger.js';
class CacheKeyGenerator {
  basePrefix = 'cache';

  constructor(options = {}) {
    this.basePrefix = options.basePrefix || this.basePrefix;
  }

  /* Gerar chaves de cache para busca e set
  Exemplo: cache:products:page:1|limit:20|category:22 */
  generateCacheKey(prefix, params = {}) {
    const sortedParams = Object.keys(params)
      .filter((key) => params[key] !== undefined && params[key] !== null)
      .sort()
      .map((key) => `${key}:${params[key]}`)
      .join('|');

    return sortedParams
      ? `${this.basePrefix}:${prefix}:${sortedParams}`
      : `${this.basePrefix}:${prefix}`;
  }

  async invalidateCacheKey(prefix) {
    try {
      const pattern = `${this.basePrefix}:${prefix}*`;
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(keys);
        logger.info(`[ REDIS ] Invalidated ${keys.length} cache keys with pattern: ${pattern}`);
      }
    } catch (error) {
      logger.warn('Failed to invalidate cache keys:', error);
    }
  }
}

export const cacheKeyGenerator = new CacheKeyGenerator();
