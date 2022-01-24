import 'systemjs-webpack-interop/auto-public-path';
import { LogoTypeSource } from '@akashaproject/ui-awf-typings';
import { rootRoute } from './routes';
import {
  IAppConfig,
  MenuItemAreaType,
  IntegrationRegistrationOptions,
} from '@akashaproject/ui-awf-typings/lib/app-loader';

/**
 * All the plugins must export an object like this:
 */
export const register: (opts: IntegrationRegistrationOptions) => IAppConfig = opts => ({
  // This is the root route in which the plugin will render.
  // Make sure to change it as it fits.
  activeWhen: (location, pathToActiveWhen) => {
    return pathToActiveWhen(rootRoute)(location);
  },
  loadingFn: () => import('./components'),
  mountsIn: opts.layoutConfig?.pluginSlotId,
  name: 'app-notifications',
  title: 'Notifications | Ethereum World',
  routes: {
    rootRoute,
  },
  menuItems: {
    label: 'Notifications',
    name: 'app-notifications',
    area: MenuItemAreaType.QuickAccessArea,
    // routes,
    logo: { type: LogoTypeSource.ICON, value: 'notifications' },
    route: rootRoute,
  },
});
