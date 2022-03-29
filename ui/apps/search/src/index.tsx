import 'systemjs-webpack-interop/auto-public-path';
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
  activeWhen: (location, pathToActiveWhen) => {
    return pathToActiveWhen(rootRoute)(location);
  },
  loadingFn: () => import('./components'),
  i18nNamespace: ['app-search'],
  mountsIn: opts.layoutConfig?.pluginSlotId,
  menuItems: {
    label: 'Search',
    area: [MenuItemAreaType.SearchArea, MenuItemAreaType.AppArea],
    type: MenuItemType.App,
    logo: { type: LogoTypeSource.ICON, value: 'search' },
    subRoutes: [],
    route: rootRoute,
  },
  routes: {
    rootRoute,
  },
});
