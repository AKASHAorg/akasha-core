import { LogoTypeSource } from '@akashaproject/ui-awf-typings';
import { rootRoute } from './routes';
import {
  IAppConfig,
  IntegrationRegistrationOptions,
  MenuItemAreaType,
  MenuItemType,
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
  name: 'ui-plugin-search',
  title: 'Search | Ethereum World',
  menuItems: {
    label: 'Search',
    name: 'ui-plugin-search',
    area: MenuItemAreaType.SearchArea,
    type: MenuItemType.App,
    logo: { type: LogoTypeSource.ICON, value: 'search' },
    subRoutes: [],
    route: rootRoute,
  },
  routes: {
    rootRoute,
  },
});
