export class TranslationConfig {
  static defaultPath = '/locales/{{lng}}/{{ns}}.json';

  static async resolvePath(): Promise<string> {
    // load the translation path dynamically in the future
    return new Promise(resolve => resolve(this.defaultPath));
  }
}

export const register = async () => {
  const translationPath = await TranslationConfig.resolvePath();
  return {
    translationPath,
  };
};
