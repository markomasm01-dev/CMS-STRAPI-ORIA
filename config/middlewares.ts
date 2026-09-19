import type { Core } from '@strapi/strapi';

const config: Core.Config.Middlewares = [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            '*.oria.com',
            'localhost:1337',
          ],
          'media-src': ["'self'", 'data:', 'blob:'],
          'frame-src': [
            "'self'",
            'https://www.youtube.com',
            'https://drive.google.com',
            'https://challenges.cloudflare.com',
          ],
          'script-src': [
            "'self'",
            "'unsafe-inline'",
            "'unsafe-eval'",
            'https://static.cloudflareinsights.com',
            'https://cms.oria.com',
            'https://challenges.cloudflare.com',
          ],
          upgradeInsecureRequests: null,
        },
      },
      // Biarkan helmet handle sisanya secara default
      // JANGAN tambahkan xFrameOptions atau xContentTypeOptions di sini
    },
  },
  {
    name: 'strapi::cors',
    config: {
      origin: [
        'http://localhost:4321',
        'https://oria.com',
        'https://www.oria.com',
        'http://localhost:1337',
      ],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
      keepHeaderOnError: true,
    },
  },
  { name: 'global::rate-limit',     config: {} },
  { name: 'global::validate-query', config: {} },
  { name: 'global::smart-search',   config: {} },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  { name: 'global::sanitize-input', config: {} },
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];

export default config;