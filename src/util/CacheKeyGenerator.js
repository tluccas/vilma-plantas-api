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
}

export const cacheKeyGenerator = new CacheKeyGenerator();
