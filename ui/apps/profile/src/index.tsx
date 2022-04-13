import 'systemjs-webpack-interop/auto-public-path';
import { LogoTypeSource } from '@akashaproject/ui-awf-typings';
import routes, { rootRoute } from './routes';
import {
  IAppConfig,
  IntegrationRegistrationOptions,
  MenuItemAreaType,
} from '@akashaproject/ui-awf-typings/lib/app-loader';

/**
 * All plugins must export an object like this:
 */
export const register: (opts: IntegrationRegistrationOptions) => IAppConfig = opts => ({
  activeWhen: (location, pathToActiveWhen) => {
    return pathToActiveWhen(rootRoute)(location);
  },
  mountsIn: opts.layoutConfig?.pluginSlotId,
  loadingFn: () => import('./components'),
  i18nNamespace: ['app-profile', 'ui-lib-feed'],
  menuItems: {
    label: 'Profile',
    area: [MenuItemAreaType.QuickAccessArea],
    // routes,
    logo: { type: LogoTypeSource.AVATAR, value: '' },
    route: rootRoute,
    subRoutes: Object.keys(routes).map((routeName, idx) => ({
      index: idx,
      label: routeName,
      route: routes[routeName],
    })),
  },
  extends: [
    {
      mountsIn: 'login',
      loadingFn: () => import('./extensions/login-modal'),
    },
    {
      mountsIn: 'update-profile',
      loadingFn: () => import('./extensions/update-profile-modal'),
    },
    {
      mountsIn: 'update-ens',
      loadingFn: () => import('./extensions/update-ens-modal'),
    },
    {
      mountsIn: 'profile-share',
      loadingFn: () => import('./extensions/share-profile-modal'),
    },
  ],
  routes: {
    rootRoute,
    ...routes,
  },
});
