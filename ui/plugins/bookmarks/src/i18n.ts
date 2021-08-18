import { initReactI18next } from 'react-i18next';
import i18next, { i18n } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-chained-backend';
import Fetch from 'i18next-fetch-backend';
import LocalStorageBackend from 'i18next-localstorage-backend';

export const setupI18next = ({ logger, namespace }): Promise<void> => {
  return new Promise(resolve => {
    i18next
      .use(initReactI18next)
      .use(Backend)
      .use(LanguageDetector)
      .use({
        type: 'logger',
        log: logger.info,
        warn: logger.warn,
        error: logger.error,
      })
      .init(
        {
          fallbackLng: 'en',
          ns: [namespace],
          saveMissing: false,
          saveMissingTo: 'all',
          load: 'languageOnly',
          debug: true,
          cleanCode: true,
          keySeparator: false,
          defaultNS: namespace,
          backend: {
            backends: [LocalStorageBackend, Fetch],
            backendOptions: [
              {
                prefix: 'i18next_res_v0',
                expirationTime: 24 * 60 * 60 * 1000,
              },
              {
                loadPath: '/locales/{{lng}}/{{ns}}.json',
              },
            ],
          },
          react: {
            useSuspense: false,
          },
        },
        () => {
          resolve();
        },
      );
  });
};

export default i18next;
