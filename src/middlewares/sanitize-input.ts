import sanitizeHtml from 'sanitize-html';

// Konfigurasi HTML yang diizinkan (untuk field description yang HTML)
const allowedHtmlConfig = {
  allowedTags: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'a', 'img', 'iframe', 'div', 'span', 'button',
    'blockquote', 'code', 'pre',
  ],
  allowedAttributes: {
    'a': ['href', 'target', 'rel', 'class'],
    'img': ['src', 'alt', 'width', 'height', 'class'],
    'iframe': ['src', 'width', 'height', 'frameborder', 'allowfullscreen', 'title'],
    'div': ['class', 'style'],
    'span': ['class', 'style'],
    'button': ['class', 'style', 'type'],
    'table': ['border', 'class'],
    'td': ['colspan', 'rowspan'],
    'th': ['colspan', 'rowspan'],
    '*': ['class'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  allowedIframeHostnames: ['www.youtube.com', 'drive.google.com'],
};

const sanitizeValue = (value: any, isHtmlField = false): any => {
  if (typeof value === 'string') {
    if (isHtmlField) {
      // Untuk field HTML (description) — sanitasi tapi pertahankan tag yang aman
      return sanitizeHtml(value, allowedHtmlConfig);
    }
    // Untuk field teks biasa — hapus semua HTML tag
    return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} });
  }
  if (Array.isArray(value)) {
    return value.map(item => sanitizeValue(item));
  }
  if (typeof value === 'object' && value !== null) {
    const sanitized: any = {};
    for (const [key, val] of Object.entries(value)) {
      // Field yang boleh HTML
      const htmlFields = ['description', 'content', 'short_description'];
      sanitized[key] = sanitizeValue(val, htmlFields.includes(key));
    }
    return sanitized;
  }
  return value;
};

export default (config, { strapi }) => {
  return async (ctx, next) => {
    // Hanya sanitasi POST, PUT, PATCH request ke API
    if (
      ['POST', 'PUT', 'PATCH'].includes(ctx.method) &&
      ctx.path.startsWith('/api/') &&
      ctx.request.body
    ) {
      try {
        ctx.request.body = sanitizeValue(ctx.request.body);
      } catch (err) {
        strapi.log.warn('Sanitize input error:', err.message);
      }
    }

    await next();
  };
};