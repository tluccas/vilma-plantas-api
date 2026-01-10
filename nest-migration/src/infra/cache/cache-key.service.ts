// import { CACHE_MANAGER } from '@nestjs/cache-manager';
// import { Inject, Injectable, Logger } from '@nestjs/common';
// import { Cache } from 'cache-manager';

// @Injectable()
// export class CacheKeyService {
//   private readonly logger = new Logger(CacheKeyService.name);
//   private readonly basePrefix = 'cache';

//   constructor(
//     @Inject(CACHE_MANAGER)
//     private readonly cache: Cache,
//   ) {}

//   generate(prefix: string, params: Record<string, any> = {}) {
//     const sortedParams = Object.keys(params)
//       .filter((key) => params[key] !== undefined && params[key] !== null)
//       .sort()
//       .map((key) => `${key}:${params[key]}`)
//       .join('|');

//     const key = sortedParams
//       ? `${this.basePrefix}:${prefix}|${sortedParams}`
//       : `${this.basePrefix}:${prefix}`;

//     this.logger.debug(`[ CACHE ] Nova chave gerada: ${key}`);
//     return key;
//   }

//   async invalidateByPrefix(prefix: string) {
//     const store: any = this.cache.store;
//     const client = store.getClient();

//     const pattern = `${this.basePrefix}:${prefix}*`;
//     let deleted = 0;

//     for await (const key of client.scanIterator({ MATCH: pattern })) {
//       await client.del(key);
//       deleted++;
//     }
//     if (deleted > 0) {
//       this.logger.debug(
//         `[ CACHE ] ${deleted} chaves removidas com o padrão: ${pattern}`,
//       );
//     }
//   }
// }
