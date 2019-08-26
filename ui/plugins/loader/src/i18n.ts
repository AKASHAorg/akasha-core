import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Fetch from 'i18next-fetch-backend';
import { IPlugin } from '.';

export default (plugin: IPlugin, logger): Promise<i18n.i18n> => {
  const { i18nConfig } = plugin;
  document.addEventListener('change-language', (ev: CustomEvent) => {
    i18n.changeLanguage(ev.detail, (err, t) => {
      if (err) {
        return logger.error(err, 'error changing lang');
      }
    });
  });
  i18nConfig.use.forEach(ext => {
    i18n.use(ext);
  });
  const defaultNS = i18nConfig.ns || plugin.name;
  return i18n
    .use(LanguageDetector)
    .use(Fetch)
    .init({
      backend: {
        // @todo: pass the hostname through app-loader.
        addPath: 'http://localhost:9001/locales/{{lng}}/{{ns}}.json',
        loadPath: 'http://localhost:9001/locales/{{lng}}/{{ns}}.json',
      },
      debug: true,
      defaultNS,
      fallbackLng: false,
      ns: [defaultNS, ...i18nConfig.loadNS],
      saveMissing: true,
      saveMissingTo: 'all',
    })
    .then(() => i18n);
};
