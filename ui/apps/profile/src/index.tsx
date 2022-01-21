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
  // This is the root route in which the plugin will render.
  // Make sure to change it as it fits.
  activeWhen: (location, pathToActiveWhen) => {
    return pathToActiveWhen(rootRoute)(location);
  },
  mountsIn: opts.layoutConfig?.pluginSlotId,
  loadingFn: () => import('./components'),
  name: 'app-profile',
  title: 'Profile | Ethereum World',
  menuItems: {
    label: 'Profile',
    name: 'app-profile',
    area: MenuItemAreaType.QuickAccessArea,
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
  },
});
