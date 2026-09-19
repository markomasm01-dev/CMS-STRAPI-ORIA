import type { Core } from '@strapi/strapi';

/**
 * Helper untuk akses Redis client dari mana saja di Strapi
 * Usage: const redis = getRedisClient(strapi);
 */
export const getRedisClient = (strapi: Core.Strapi) => {
  return (strapi as any).redis?.connections?.default?.client;
};

/**
 * Set cache dengan TTL (Time To Live) dalam detik
 * Usage: await setCache(strapi, 'key', data, 300);
 */
export const setCache = async (
  strapi: Core.Strapi,
  key: string,
  value: any,
  ttlSeconds: number = 300
): Promise<void> => {
  const client = getRedisClient(strapi);
  if (!client) return;
  await client.setex(`strapi:${key}`, ttlSeconds, JSON.stringify(value));
};

/**
 * Get cache
 * Usage: const data = await getCache(strapi, 'key');
 */
export const getCache = async (
  strapi: Core.Strapi,
  key: string
): Promise<any | null> => {
  const client = getRedisClient(strapi);
  if (!client) return null;
  const cached = await client.get(`strapi:${key}`);
  return cached ? JSON.parse(cached) : null;
};

/**
 * Hapus cache berdasarkan pattern
 * Usage: await invalidateCache(strapi, 'products:*');
 */
export const invalidateCache = async (
  strapi: Core.Strapi,
  pattern: string
): Promise<void> => {
  const client = getRedisClient(strapi);
  if (!client) return;
  const keys = await client.keys(`strapi:${pattern}`);
  if (keys.length > 0) {
    await client.del(...keys);
    strapi.log.info(`Cache invalidated: ${keys.length} keys (pattern: ${pattern})`);
  }
};