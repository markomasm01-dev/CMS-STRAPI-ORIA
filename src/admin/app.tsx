import type { StrapiApp } from '@strapi/strapi/admin';
import './custom.css';

// Enforce Light Mode as default
if (typeof window !== 'undefined' && window.localStorage) {
  const currentTheme = window.localStorage.getItem('STRAPI_THEME');
  if (!currentTheme || currentTheme === 'system' || currentTheme === 'dark') {
    window.localStorage.setItem('STRAPI_THEME', 'light');
  }
  document.documentElement.setAttribute('data-theme', 'light');
}

export default {
  config: {
    locales: [],
  },
  bootstrap(app: StrapiApp) {
    if (typeof window !== 'undefined' && window.localStorage) {
      const currentTheme = window.localStorage.getItem('STRAPI_THEME');
      if (!currentTheme || currentTheme === 'system' || currentTheme === 'dark') {
        window.localStorage.setItem('STRAPI_THEME', 'light');
      }
    }
    if (typeof document !== 'undefined') {
      const existing = document.getElementById('strapi-custom-admin-styles');
      if (!existing) {
        const style = document.createElement('style');
        style.id = 'strapi-custom-admin-styles';
        style.innerHTML = `
          .ck-editor__editable {
            min-height: 380px !important;
            max-height: 800px !important;
            font-size: 14.5px !important;
            line-height: 1.65 !important;
            padding: 16px 20px !important;
          }
          textarea[name="short_description"] {
            min-height: 130px !important;
            font-size: 14px !important;
            line-height: 1.5 !important;
          }
          textarea[name="seo_description"] {
            min-height: 110px !important;
            font-size: 14px !important;
            line-height: 1.5 !important;
          }
          textarea[name="whatsapp_message"] {
            min-height: 100px !important;
          }
          textarea[name="description"] {
            min-height: 380px !important;
            font-size: 14.5px !important;
            line-height: 1.65 !important;
          }
        `;
        document.head.appendChild(style);
      }
    }
  },
};

