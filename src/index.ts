import type { Core } from '@strapi/strapi';
import { getRedisClient, invalidateCache } from './utils/redis';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }: { strapi: Core.Strapi }) {
    // Verifikasi koneksi Redis saat startup
    setTimeout(async () => {
      try {
        const client = getRedisClient(strapi);
        if (!client) {
          strapi.log.warn('Redis: client tidak ditemukan');
          return;
        }
        const pong = await client.ping();
        if (pong === 'PONG') {
          strapi.log.info('✅ Redis terhubung dan berjalan');
        }
      } catch (err: any) {
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
  bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Auto invalidate cache saat ada perubahan konten
    strapi.db.lifecycles.subscribe({
      afterCreate: async (event) => {
        const model = event.model.uid.replace('api::', '').replace('.', ':');
        await invalidateCache(strapi, `${model}:*`);
      },
      afterUpdate: async (event) => {
        const model = event.model.uid.replace('api::', '').replace('.', ':');
        await invalidateCache(strapi, `${model}:*`);
      },
      afterDelete: async (event) => {
        const model = event.model.uid.replace('api::', '').replace('.', ':');
        await invalidateCache(strapi, `${model}:*`);
      },
    });
  },
};