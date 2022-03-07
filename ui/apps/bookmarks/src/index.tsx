import 'systemjs-webpack-interop/auto-public-path';
import { rootRoute } from './routes';
import {
  IAppConfig,
  IntegrationRegistrationOptions,
} from '@akashaproject/ui-awf-typings/lib/app-loader';

const findTopbarQuickAccess = (integrations: IntegrationRegistrationOptions['integrations']) => {
  if (!integrations) {
    return null;
  }
  const topbarConf = Object.entries(integrations.configs).find(intConf => {
    const [, config] = intConf;
    if (config.tags && config.tags.includes('topbar')) {
      return true;
    }
    return false;
  });
  if (topbarConf) {
    const [, config] = topbarConf;
    if (config.extensions) {
      return config.extensions.QuickAccess;
    }
    return null;
  }
  return null;
};
/**
 * All apps must export an object like this:
 */
export const register: (opts: IntegrationRegistrationOptions) => IAppConfig = opts => ({
  // This is the root route in which the plugin will render.
  // Make sure to change it as it fits.
  activeWhen: (location, pathToActiveWhen) => {
    return pathToActiveWhen(rootRoute)(location);
  },
  loadingFn: () => import('./components'),
  mountsIn: opts.layoutConfig?.pluginSlotId,
  i18nNamespace: ['app-bookmarks'],
  routes: {
    rootRoute,
  },
  extends: [
    {
      mountsIn: options => {
        if (options.extensionData.name.startsWith('entry-card-actions-right_')) {
          return options.extensionData.name;
        }
        return null;
      },
      loadingFn: () => import('./extensions/entry-card-save-button'),
    },
    {
      mountsIn: mountOptions => findTopbarQuickAccess(mountOptions.integrations),
      loadingFn: () => import('./extensions/topbar-bookmarks-button'),
    },
  ],
});
