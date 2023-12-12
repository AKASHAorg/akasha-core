import getSDK from '@akashaorg/awf-sdk';
import { setupI18next } from './i18n';
import i18next, { i18n } from 'i18next';

export class TranslationPlugin {
  static defaultPath = '/locales/{{lng}}/{{ns}}.json';
  static i18n: i18n;

  static async initTranslation(): Promise<i18n> {
    const translationPath = await this.resolvePath();
    const sdk = getSDK();
    const logger = sdk.services.log.create('app-translation');
    await setupI18next({
      logger,
      translationPath: translationPath || '/locales/{{lng}}/{{ns}}.json',
    });
    if (i18next.isInitialized) {
      return i18next;
    }
    return new Promise(resolve => {
      i18next.on('initialized', () => resolve(i18next));
    });
  }

  static async resolvePath(): Promise<string> {
    // load the translation path dynamically in the future
    return new Promise(resolve => resolve(this.defaultPath));
  }
}
