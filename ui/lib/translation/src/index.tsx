import getSDK from '@akashaproject/awf-sdk';
import { setupI18next } from './i18n';

export class TranslationPlugin {
  static defaultPath = '/locales/{{lng}}/{{ns}}.json';
  static i18n;

  static async initTranslation() {
    if (TranslationPlugin.i18n) {
      return TranslationPlugin.i18n;
    }
    const translationPath = await this.resolvePath();
    const sdk = getSDK();
    const logger = sdk.services.log.create('ui-lib-translation');
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
    name: 'ui-lib-translation',
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
