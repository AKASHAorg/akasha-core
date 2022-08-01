import { PluginConf } from '@akashaorg/typings';
import { i18n } from 'i18next';

export const loadI18nNamespaces = async (plugins: PluginConf, namespaces: string | string[]) => {
  if (plugins.hasOwnProperty('translation')) {
    const i18n = plugins.translation.i18n as i18n;
    if (Array.isArray(namespaces)) {
      for (const namespace of namespaces) {
        if (!i18n.options?.ns?.includes(namespace)) {
          await i18n.loadNamespaces(namespace);
        }
      }
    } else if (namespaces) {
      if (!i18n.options?.ns?.includes(namespaces)) {
        await i18n.loadNamespaces(namespaces);
      }
    }
  }
};
