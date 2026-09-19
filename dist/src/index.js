"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("./utils/redis");
exports.default = {
    /**
     * An asynchronous register function that runs before
     * your application is initialized.
     *
     * This gives you an opportunity to extend code.
     */
    register({ strapi }) {
        // Verifikasi koneksi Redis saat startup
        setTimeout(async () => {
            try {
                const client = (0, redis_1.getRedisClient)(strapi);
                if (!client) {
                    strapi.log.warn('Redis: client tidak ditemukan');
                    return;
                }
                const pong = await client.ping();
                if (pong === 'PONG') {
                    strapi.log.info('✅ Redis terhubung dan berjalan');
                }
            }
            catch (err) {
                strapi.log.error('Redis connection error: ' + err.message);
            }
        }, 3000);
    },
    /**
     * An asynchronous bootstrap function that runs before
     * your application gets started.
     *
     * This gives you an opportunity to set up your data model,
     * run jobs, or perform some special logic.
     */
    bootstrap({ strapi }) {
        // Auto invalidate cache saat ada perubahan konten
        strapi.db.lifecycles.subscribe({
            afterCreate: async (event) => {
                const model = event.model.uid.replace('api::', '').replace('.', ':');
                await (0, redis_1.invalidateCache)(strapi, `${model}:*`);
            },
            afterUpdate: async (event) => {
                const model = event.model.uid.replace('api::', '').replace('.', ':');
                await (0, redis_1.invalidateCache)(strapi, `${model}:*`);
            },
            afterDelete: async (event) => {
                const model = event.model.uid.replace('api::', '').replace('.', ':');
                await (0, redis_1.invalidateCache)(strapi, `${model}:*`);
            },
        });
    },
};
