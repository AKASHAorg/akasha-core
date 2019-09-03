import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Fetch from 'i18next-fetch-backend';
import { IPlugin } from '.';

const i18nDefaultConfig: i18n.InitOptions = {
  backend: {
    // @todo: pass the hostname through app-loader.
    addPath: 'http://localhost:9001/locales/{{lng}}/{{ns}}.json',
    loadPath: 'http://localhost:9001/locales/{{lng}}/{{ns}}.json',
  },
  debug: true,
  fallbackLng: false,
  ns: [],
  saveMissing: true,
  saveMissingTo: 'all',
};

export default class TranslationManager {
  private i18nInstances: any;
  private logger;
  constructor(logger) {
    this.i18nInstances = {};
    this.logger = logger;
  }
  public createInstance(plugin: IPlugin, logger) {
    const { i18nConfig } = plugin;
    const defaultNS = i18nConfig.ns || plugin.name;

    const i18nInstance = i18n
      .createInstance({
        ...i18nDefaultConfig,
        defaultNS,
      })
      .use(LanguageDetector)
      .use(Fetch);

    i18nConfig.use.forEach(ext => {
      i18nInstance.use(ext);
    });
    this.i18nInstances[plugin.name] = i18nInstance;
    return i18nInstance;
  }
  public initI18n(): i18n.i18n {
    document.addEventListener('change-language', this.onLanguageChange.bind(this));
    i18n.use(LanguageDetector).use(Fetch);
    return i18n;
  }
  public getInstance(name: string) {
    return this.i18nInstances[name];
  }
  private onLanguageChange(ev: CustomEvent) {
    i18n.changeLanguage(ev.detail, (err, t) => {
      if (err) {
        return this.logger.error(err, 'error changing lang');
      }
    });
  }
}
