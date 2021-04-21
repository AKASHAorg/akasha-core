import i18ns from 'i18next';
import { initReactI18next } from 'react-i18next';

const i18n = i18ns.use(initReactI18next)
  .init({
    fallbackLng: 'en',
    ns: ['translations'],
    defaultNS: 'translations',

    debug: true,

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },

    // resources: { en: {}, es: {}, de: {} },
    react: {
      wait: true
    }
  });

export default i18n;
