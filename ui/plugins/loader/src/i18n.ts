import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Fetch from 'i18next-fetch-backend';
import { IPlugin } from './interfaces';

const i18nDefaultConfig: i18n.InitOptions = {
  backend: {
    // @todo: pass the hostname through app-loader.
    addPath: 'http://localhost:9001/locales/{{lng}}/{{ns}}.json',
    loadPath: 'http://localhost:9001/locales/{{lng}}/{{ns}}.json',
  },
  // debug: true,
  fallbackLng: false,
  ns: [],
  saveMissing: true,
  saveMissingTo: 'all',
  load: 'currentOnly',
};

export default class TranslationManager {
  private i18nInstances: any;
  private logger;
  constructor(logger) {
    this.i18nInstances = {};
    this.logger = logger;
  }
  public createInstance(plugin: IPlugin, logger): i18n.i18n {
    const { i18nConfig } = plugin;
    const defaultNS = i18nConfig.ns || plugin.name;

    const i18nInstance = i18n
      .createInstance({
        ...i18nDefaultConfig,
        defaultNS,
      })
      .use(LanguageDetector)
      .use(Fetch);

    this.i18nInstances[plugin.name] = i18nInstance;
    return i18nInstance;
  }

  public async initI18nFor(plugin: IPlugin): Promise<void> {
    const { name, i18nConfig } = plugin;
    document.addEventListener('change-language', this.onLanguageChange(plugin.name));
    const instance: i18n.i18n = this.i18nInstances[name];
    i18nConfig.use.forEach(ext => {
      instance.use(ext);
    });
    await instance.init();
    return await instance.loadNamespaces([...i18nConfig.loadNS, plugin.name]);
  }

  public getInstance(name: string) {
    return this.i18nInstances[name];
  }

  private onLanguageChange(pluginName) {
    return (ev: CustomEvent) => {
      this.getInstance(pluginName).changeLanguage(ev.detail, err => {
        if (err) {
          return this.logger.error('error changing language', err.message, err);
        }
      });
    };
  }
}
