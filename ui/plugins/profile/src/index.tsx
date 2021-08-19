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
  name: 'ui-plugin-profile',
  title: 'Profile | Ethereum World',
  menuItems: {
    label: 'Profile',
    name: 'ui-plugin-profile',
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
      mountsIn: 'signin',
      loadingFn: () => import('./extensions/sign-in-modal'),
    },
    {
      mountsIn: 'signup',
      loadingFn: () => import('./extensions/sign-up-modal'),
    },
  ],
  routes: {
    rootRoute,
  },
});
