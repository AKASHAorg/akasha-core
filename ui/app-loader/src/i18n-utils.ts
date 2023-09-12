import { IPluginsMap } from '@akashaorg/typings/lib/ui';
import { i18n } from 'i18next';

export const loadI18nNamespaces = async (plugins: IPluginsMap, namespaces: string | string[]) => {
  if (plugins['@akashaorg/app-translation'].hasOwnProperty('translation')) {
    const i18n = plugins['@akashaorg/app-translation'].translation.i18n as i18n;
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
