import 'systemjs-webpack-interop/auto-public-path';
import { LogoTypeSource } from '@akashaproject/ui-awf-typings';
import { rootRoute } from './routes';
import {
  IAppConfig,
  IntegrationRegistrationOptions,
  // IWidgetConfig,
  MenuItemAreaType,
} from '@akashaproject/ui-awf-typings/lib/app-loader';

// const findTopbarQuickAccess = (integrations: IntegrationRegistrationOptions['integrations']) => {
//   if (!integrations) {
//     return null;
//   }
//   const topbarConf = Object.entries(integrations.configs).find(intConf => {
//     const [, config] = intConf as [string, IAppConfig | IWidgetConfig];
//     if (config.tags && config.tags.includes('topbar')) {
//       return true;
//     }
//     return false;
//   });
//   if (topbarConf) {
//     const [, config] = topbarConf as [string, IAppConfig | IWidgetConfig];
//     if (config.extensions) {
//       return config.extensions.QuickAccess;
//     }
//     return null;
//   }
//   return null;
// };
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
  name: 'app-bookmarks',
  routes: {
    rootRoute,
  },
  extends: [
    // {
    //   mountsIn: mountOptions => findTopbarQuickAccess(mountOptions.integrations),
    //   loadingFn: () => import('./bookmarks-topbar-button'),
    // },
  ],
  title: 'Bookmarks | Ethereum World',
  menuItems: {
    label: 'Bookmarks',
    route: rootRoute,
    area: MenuItemAreaType.QuickAccessArea,
    name: 'app-bookmarks',
    logo: { type: LogoTypeSource.ICON, value: 'bookmark' },
  },
});
