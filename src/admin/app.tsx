import type { StrapiApp } from '@strapi/strapi/admin';
import AuthLogo from './extensions/logo.png';
import MenuLogo from './extensions/logo.png';
import Favicon from './extensions/favicon.png';
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
    auth: {
      logo: AuthLogo,
    },
    menu: {
      logo: MenuLogo,
    },
    head: {
      favicon: Favicon,
    },
    locales: [],
    tutorials: false,
    notifications: {
      releases: false,
    },
    translations: {
      en: {
        'Auth.form.welcome.title': 'Welcome to ORIA CMS',
        'Auth.form.welcome.subtitle': 'Log in to manage ORIA Industrial Machinery & Catalog',
        'app.components.LeftMenu.navbrand.title': 'ORIA Industrial',
        'app.components.LeftMenu.navbrand.workplace': 'Precision Printing',
      },
      id: {
        'Auth.form.welcome.title': 'Selamat Datang di CMS ORIA',
        'Auth.form.welcome.subtitle': 'Masuk untuk mengelola katalog mesin industri ORIA',
        'app.components.LeftMenu.navbrand.title': 'ORIA Industrial',
        'app.components.LeftMenu.navbrand.workplace': 'Precision Printing',
      },
    },
    theme: {
      light: {
        colors: {
          buttonPrimary500: '#18181b',
          buttonPrimary600: '#09090b',
          primary500: '#18181b',
          primary600: '#09090b',
          primary700: '#000000',
          success100: '#fef9c3',
          success500: '#FFE500',
          success600: '#eab308',
        },
      },
      dark: {
        colors: {
          buttonPrimary500: '#FFE500',
          buttonPrimary600: '#eab308',
          primary500: '#FFE500',
          primary600: '#eab308',
          primary700: '#ca8a04',
        },
      },
    },
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
