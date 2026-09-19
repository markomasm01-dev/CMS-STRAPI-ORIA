import type { Core } from '@strapi/strapi';
import { getCache, setCache } from './redis';

/**
 * Fetch dengan Redis cache
 * Otomatis cache hasil query dan return dari cache kalau ada
 */
export const cachedFind = async (
  strapi: Core.Strapi,
  uid: string,
  params: any = {},
  ttl: number = 300
): Promise<any> => {
  const cacheKey = `${uid}:${JSON.stringify(params)}`;

  // Cek cache dulu
  const cached = await getCache(strapi, cacheKey);
  if (cached) {
    strapi.log.debug(`Cache HIT: ${cacheKey}`);
    return cached;
  }

  // Query ke database
  const result = await strapi.db.query(uid).findMany(params);

  // Simpan ke cache
  await setCache(strapi, cacheKey, result, ttl);
  strapi.log.debug(`Cache MISS → stored: ${cacheKey}`);

  return result;
};

/**
 * Pagination helper
 */
export const paginate = (page: number = 1, pageSize: number = 25) => ({
  offset: (page - 1) * pageSize,
  limit: pageSize,
});