"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (config, { strapi }) => {
    return async (ctx, next) => {
        // Only validate queries for public API endpoints
        if (!ctx.path.startsWith('/api/')) {
            return await next();
        }
        // Deteksi SQL injection pattern di query params
        const sqlPatterns = [
            /\bUNION\s+(ALL\s+)?SELECT\b/i,
            /\bSELECT\s+.*\s+FROM\b/i,
            /\bINSERT\s+INTO\b/i,
            /\bUPDATE\s+.*\s+SET\b/i,
            /\bDELETE\s+FROM\b/i,
            /\bDROP\s+(TABLE|DATABASE|VIEW)\b/i,
            /(--|\/\*|\*\/)/,
            /\b(OR|AND)\s+\d+\s*=\s*\d+/i,
            /\bxp_cmdshell\b/i,
        ];
        // Deteksi XSS pattern di query params
        const xssPatterns = [
            /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
            /javascript:/gi,
            /on\w+\s*=/gi,
            /eval\s*\(/gi,
        ];
        const queryString = JSON.stringify(ctx.query);
        const isSqlInjection = sqlPatterns.some(p => p.test(queryString));
        const isXss = xssPatterns.some(p => p.test(queryString));
        if (isSqlInjection || isXss) {
            strapi.log.warn(`Suspicious request blocked: IP ${ctx.request.ip} on ${ctx.path} - ` +
                `${isSqlInjection ? 'SQL Injection' : 'XSS'} attempt`);
            ctx.status = 400;
            ctx.body = {
                error: {
                    status: 400,
                    name: 'BadRequest',
                    message: 'Request tidak valid.',
                }
            };
            return;
        }
        await next();
    };
};
