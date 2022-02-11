export const TRANSLATION_MIDDLEWARE = 'translation';

export class TranslationConfig {
  static defaultPath = '/locales/{{lng}}/{{ns}}.json';

  static async run(middlewareConfigs: Array<Record<string, unknown>>) {
    middlewareConfigs.push({
      middlewareName: 'translation',
      translationPath: await this.resolvePath(),
    });
  }

  static async resolvePath(): Promise<string> {
    // load the translation path dynamically in the future
    return new Promise(resolve => resolve(this.defaultPath));
  }
}
