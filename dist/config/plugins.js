"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
if (!process.env.STRAPI_ADMIN_LLM_TRANSLATOR_LLM_MODEL) {
    process.env.STRAPI_ADMIN_LLM_TRANSLATOR_LLM_MODEL = 'gemini-2.5-flash';
}
if (!process.env.STRAPI_ADMIN_LLM_TRANSLATOR_LLM_BASE_URL) {
    process.env.STRAPI_ADMIN_LLM_TRANSLATOR_LLM_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/openai/';
}
exports.default = () => {
    return {
        upload: {
            config: {
                sizeLimit: 10 * 1024 * 1024,
                breakpoints: {
                    xlarge: 1920,
                    large: 1280,
                    medium: 960,
                    small: 640,
                    xsmall: 320,
                },
            },
        },
        'webp-converter': {
            enabled: true,
            config: {
                mimeTypes: ['image/png', 'image/jpeg', 'image/jpg'],
                options: {
                    quality: 85,
                    lossless: false,
                    effort: 4,
                },
            },
        },
        redis: {
            enabled: Boolean(process.env.REDIS_SOCKET_PATH || (process.env.REDIS_HOST && process.env.REDIS_ENABLED === 'true')),
            config: {
                connections: {
                    default: {
                        connection: process.env.REDIS_SOCKET_PATH
                            ? {
                                path: process.env.REDIS_SOCKET_PATH,
                                password: process.env.REDIS_PASSWORD || undefined,
                                db: parseInt(process.env.REDIS_DB || '0'),
                            }
                            : {
                                host: process.env.REDIS_HOST || '127.0.0.1',
                                port: parseInt(process.env.REDIS_PORT || '6379'),
                                password: process.env.REDIS_PASSWORD || undefined,
                                db: parseInt(process.env.REDIS_DB || '0'),
                                ...((process.env.REDIS_TLS === 'true' ||
                                    (process.env.REDIS_HOST && process.env.REDIS_HOST.includes('upstash.io'))) && {
                                    tls: {
                                        rejectUnauthorized: false,
                                    },
                                }),
                            },
                        settings: {
                            debug: false,
                        },
                    },
                },
            },
        },
        'strapi-llm-translator': {
            enabled: true,
        },
    };
};
