import 'systemjs-webpack-interop/auto-public-path';
import {
  IAppConfig,
  IntegrationRegistrationOptions,
  MenuItemAreaType,
  LogoTypeSource,
} from '@akashaorg/typings/ui';

import routes, { EDIT, FOLLOWERS, FOLLOWING } from './routes';
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
  ],
  extends: (matcher, loader) => {
    matcher({
      login: loader(() => import('./extensions/login-modal')),
      share: loader(() => import('./extensions/share-modal')),
    });
  },
  routes: {
    edit: routes[EDIT],
    followers: routes[FOLLOWERS],
    following: routes[FOLLOWING],
    rootRoute: '',
  },
});
