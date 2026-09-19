"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginate = exports.cachedFind = void 0;
const redis_1 = require("./redis");
/**
 * Fetch dengan Redis cache
 * Otomatis cache hasil query dan return dari cache kalau ada
 */
const cachedFind = async (strapi, uid, params = {}, ttl = 300) => {
    const cacheKey = `${uid}:${JSON.stringify(params)}`;
    // Cek cache dulu
    const cached = await (0, redis_1.getCache)(strapi, cacheKey);
    if (cached) {
        strapi.log.debug(`Cache HIT: ${cacheKey}`);
        return cached;
    }
    // Query ke database
    const result = await strapi.db.query(uid).findMany(params);
    // Simpan ke cache
    await (0, redis_1.setCache)(strapi, cacheKey, result, ttl);
    strapi.log.debug(`Cache MISS → stored: ${cacheKey}`);
    return result;
};
exports.cachedFind = cachedFind;
/**
 * Pagination helper
 */
const paginate = (page = 1, pageSize = 25) => ({
    offset: (page - 1) * pageSize,
    limit: pageSize,
});
exports.paginate = paginate;
