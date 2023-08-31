import getSDK from '@akashaorg/awf-sdk';
import { setupI18next } from './i18n';
import { i18n } from 'i18next';

export class TranslationPlugin {
  static defaultPath = '/locales/{{lng}}/{{ns}}.json';
  static i18n: i18n;

  static async initTranslation() {
    if (TranslationPlugin.i18n) {
      return TranslationPlugin.i18n;
    }
    const translationPath = await this.resolvePath();
    const sdk = getSDK();
    const logger = sdk.services.log.create('app-translation');
    TranslationPlugin.i18n = await setupI18next({
      logger,
      translationPath: translationPath || '/locales/{{lng}}/{{ns}}.json',
    });
    return TranslationPlugin.i18n;
  }

  static async resolvePath(): Promise<string> {
    // load the translation path dynamically in the future
    return new Promise(resolve => resolve(this.defaultPath));
  }
}

export const register = async () => {
  TranslationPlugin.i18n = await TranslationPlugin.initTranslation();
  return {
    loadingFn: () => Promise.resolve(),
    name: 'app-translation',
  };
};

export const getPlugin = async () => {
  TranslationPlugin.i18n = await TranslationPlugin.initTranslation();
  return {
    translation: {
      i18n: TranslationPlugin.i18n,
    },
  };
};
