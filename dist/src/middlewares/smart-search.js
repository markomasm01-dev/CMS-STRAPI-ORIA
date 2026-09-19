"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (config, { strapi }) => {
    return async (ctx, next) => {
        // Intercept search queries (_q, search, q) in Admin Content Manager & Public API
        const searchQuery = ctx.query._q || ctx.query.search || ctx.query.q;
        if (searchQuery && typeof searchQuery === 'string' && searchQuery.trim().length > 0) {
            const rawQuery = searchQuery.trim();
            const words = rawQuery.split(/\s+/).filter(w => w.length > 0);
            if (words.length > 0) {
                // Determine search field dynamically based on content type attributes
                let searchField = null;
                // 1. Check Content Manager endpoint
                const cmMatch = ctx.path.match(/\/content-manager\/(?:collection|single)-types\/([^/?]+)/);
                if (cmMatch) {
                    const uid = decodeURIComponent(cmMatch[1]);
                    const model = strapi.contentType(uid);
                    if (model && model.attributes) {
                        if (model.attributes.title) {
                            searchField = 'title';
                        }
                        else if (model.attributes.name) {
                            searchField = 'name';
                        }
                        else if (model.attributes.username) {
                            searchField = 'username';
                        }
                    }
                }
                else if (ctx.path.startsWith('/api/')) {
                    // 2. Check Public API endpoints
                    if (ctx.path.includes('/articles')) {
                        searchField = 'title';
                    }
                    else if (ctx.path.includes('/products') || ctx.path.includes('/product-categories')) {
                        searchField = 'name';
                    }
                }
                // Only apply smart filter if a valid searchField exists for this content type
                if (searchField) {
                    const wordFilters = words.map(word => ({
                        [searchField]: { $containsi: word }
                    }));
                    const smartFilter = words.length === 1 ? wordFilters[0] : { $and: wordFilters };
                    // Parse existing filters if passed as a string or object
                    let currentFilters = ctx.query.filters;
                    if (typeof currentFilters === 'string') {
                        try {
                            currentFilters = JSON.parse(currentFilters);
                        }
                        catch (e) {
                            currentFilters = null;
                        }
                    }
                    if (currentFilters && typeof currentFilters === 'object' && Object.keys(currentFilters).length > 0) {
                        ctx.query.filters = {
                            $and: [currentFilters, smartFilter]
                        };
                    }
                    else {
                        ctx.query.filters = smartFilter;
                    }
                    // Remove _q/search/q so Strapi does not run its loose fallback DB search
                    delete ctx.query._q;
                    delete ctx.query.search;
                    delete ctx.query.q;
                }
            }
        }
        await next();
    };
};
