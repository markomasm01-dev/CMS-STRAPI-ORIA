"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (config, { strapi }) => {
    return async (ctx, next) => {
        var _a, _b, _c;
        // Skip rate limiting for static uploads
        if (ctx.path.startsWith('/uploads/')) {
            return await next();
        }
        const redis = (_c = (_b = (_a = strapi.redis) === null || _a === void 0 ? void 0 : _a.connections) === null || _b === void 0 ? void 0 : _b.default) === null || _c === void 0 ? void 0 : _c.client;
        // Ambil IP user
        const ip = ctx.request.ip ||
            ctx.request.headers['x-forwarded-for'] ||
            ctx.request.headers['x-real-ip'] ||
            'unknown';
        // Skip rate limiting for localhost requests (essential for local Astro pre-rendering/build)
        if (ip === '127.0.0.1' || ip === '::1' || ip === 'localhost' || ip === '::ffff:127.0.0.1') {
            return await next();
        }
        // Endpoint yang perlu dilindungi ketat
        const strictEndpoints = [
            '/admin/login',
            '/admin/register',
            '/api/auth',
        ];
        const isStrict = strictEndpoints.some(ep => ctx.path.startsWith(ep));
        // Limit: strict = 5 request/menit, normal = 100 request/menit
        const limit = isStrict ? 5 : 100;
        const window = 60; // detik
        const key = `ratelimit:${ip}:${ctx.path}`;
        if (redis) {
            try {
                const current = await redis.incr(key);
                if (current === 1) {
                    await redis.expire(key, window);
                }
                // Set header info
                ctx.set('X-RateLimit-Limit', String(limit));
                ctx.set('X-RateLimit-Remaining', String(Math.max(0, limit - current)));
                if (current > limit) {
                    ctx.status = 429;
                    ctx.body = {
                        error: {
                            status: 429,
                            name: 'TooManyRequests',
                            message: 'Terlalu banyak request. Coba lagi dalam 1 menit.',
                        }
                    };
                    strapi.log.warn(`Rate limit exceeded: IP ${ip} on ${ctx.path}`);
                    return;
                }
            }
            catch (err) {
                // Kalau Redis error, tetap lanjutkan request
                strapi.log.warn('Rate limit Redis error:', err.message);
            }
        }
        await next();
    };
};
