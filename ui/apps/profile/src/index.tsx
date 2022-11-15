import 'systemjs-webpack-interop/auto-public-path';
import {
  IAppConfig,
  IntegrationRegistrationOptions,
  MenuItemAreaType,
  LogoTypeSource,
} from '@akashaorg/typings/ui';

import routes, { DEV_DASHBOARD, MY_PROFILE, UPDATE_PROFILE } from './routes';
/**
 * All plugins must export an object like this:
 */
export const register: (opts: IntegrationRegistrationOptions) => IAppConfig = opts => ({
  mountsIn: opts.layoutConfig?.pluginSlotId,
  loadingFn: () => import('./components'),
  i18nNamespace: ['app-profile', 'ui-lib-feed'],
  menuItems: [
    {
      label: 'Profile',
      area: [MenuItemAreaType.QuickAccessArea],
      // routes,
      logo: { type: LogoTypeSource.AVATAR, value: '' },
      subRoutes: Object.keys(routes).map((routeName, idx) => ({
        index: idx,
        label: routeName,
        route: routes[routeName],
      })),
    },
    {
      label: 'Dev Dashboard',
      area: [MenuItemAreaType.AppArea],
      route: routes[DEV_DASHBOARD],
      logo: { type: LogoTypeSource.ICON, value: 'dashboard' },
      subRoutes: [],
    },
  ],
  extends: (matcher, loader) => {
    matcher({
      login: loader(() => import('./extensions/login-modal')),
      'profile-share': loader(() => import('./extensions/share-profile-modal')),
      'delete-dev-key': loader(() => import('./extensions/delete-dev-key')),
    });
  },
  routes: {
    myProfile: routes[MY_PROFILE],
    updateProfile: routes[UPDATE_PROFILE],
    rootRoute: '',
  },
});
