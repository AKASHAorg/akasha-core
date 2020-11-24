import i18n, { i18n as i18nType, InitOptions, LoggerModule } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-chained-backend';
import Fetch from 'i18next-fetch-backend';
import LocalStorageBackend from 'i18next-localstorage-backend';
import { IPlugin, IWidget } from '@akashaproject/ui-awf-typings/lib/app-loader';

const i18nDefaultConfig: InitOptions = {
  fallbackLng: 'en',
  ns: [],
  saveMissing: false,
  saveMissingTo: 'all',
  load: 'languageOnly',
  debug: true,
  cleanCode: true,
};
const backends = {
  backends: [LocalStorageBackend, Fetch],
  backendOptions: [
    {
      prefix: 'i18next_res_v0',
      expirationTime: 24 * 60 * 60 * 1000,
    },
    {
      loadPath: '/public/locales/{{lng}}/{{ns}}.json',
    },
  ],
};

export default class TranslationManager {
  private readonly i18nInstances: any;
  private logger;

  constructor(logger) {
    this.i18nInstances = {};
    this.logger = logger;
  }

  public createInstance(plugin: IPlugin | IWidget, logger): i18nType {
    const logPlugin: LoggerModule = {
      type: 'logger',
      log: logger.info,
      warn: logger.warn,
      error: logger.error,
    };
    const i18nInstance = i18n.createInstance().use(Backend).use(LanguageDetector).use(logPlugin);

    this.i18nInstances[plugin.name] = i18nInstance;
    return i18nInstance;
  }

  public async initI18nFor(plugin: IPlugin | IWidget): Promise<void> {
    const { name, i18nConfig } = plugin;
    const instance: i18nType = this.i18nInstances[name];
    // binds react-i18next instance to current i18next instance
    i18nConfig.use.forEach(ext => {
      instance.use(ext);
    });
    await instance.init({
      ...i18nDefaultConfig,
      defaultNS: i18nConfig.ns || plugin.name,
      ns: i18nConfig.loadNS,
      backend: backends,
    });
    document.addEventListener('change-language', this.onLanguageChange(plugin.name));
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
