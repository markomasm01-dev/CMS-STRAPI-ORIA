"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidateCache = exports.getCache = exports.setCache = exports.getRedisClient = void 0;
/**
 * Helper untuk akses Redis client dari mana saja di Strapi
 * Usage: const redis = getRedisClient(strapi);
 */
const getRedisClient = (strapi) => {
    var _a, _b, _c;
    return (_c = (_b = (_a = strapi.redis) === null || _a === void 0 ? void 0 : _a.connections) === null || _b === void 0 ? void 0 : _b.default) === null || _c === void 0 ? void 0 : _c.client;
};
exports.getRedisClient = getRedisClient;
/**
 * Set cache dengan TTL (Time To Live) dalam detik
 * Usage: await setCache(strapi, 'key', data, 300);
 */
const setCache = async (strapi, key, value, ttlSeconds = 300) => {
    const client = (0, exports.getRedisClient)(strapi);
    if (!client)
        return;
    await client.setex(`strapi:${key}`, ttlSeconds, JSON.stringify(value));
};
exports.setCache = setCache;
/**
 * Get cache
 * Usage: const data = await getCache(strapi, 'key');
 */
const getCache = async (strapi, key) => {
    const client = (0, exports.getRedisClient)(strapi);
    if (!client)
        return null;
    const cached = await client.get(`strapi:${key}`);
    return cached ? JSON.parse(cached) : null;
};
exports.getCache = getCache;
/**
 * Hapus cache berdasarkan pattern
 * Usage: await invalidateCache(strapi, 'products:*');
 */
const invalidateCache = async (strapi, pattern) => {
    const client = (0, exports.getRedisClient)(strapi);
    if (!client)
        return;
    const keys = await client.keys(`strapi:${pattern}`);
    if (keys.length > 0) {
        await client.del(...keys);
        strapi.log.info(`Cache invalidated: ${keys.length} keys (pattern: ${pattern})`);
    }
};
exports.invalidateCache = invalidateCache;
