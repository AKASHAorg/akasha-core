import 'systemjs-webpack-interop/auto-public-path';
import { LogoTypeSource } from '@akashaorg/ui-awf-typings';
import routes, { ONBOARDING, RESULTS } from './routes';
import {
  IAppConfig,
  IntegrationRegistrationOptions,
  MenuItemAreaType,
  MenuItemType,
} from '@akashaorg/ui-awf-typings/lib/app-loader';

/**
 * All the plugins must export an object like this:
 */
export const register: (opts: IntegrationRegistrationOptions) => IAppConfig = opts => ({
  loadingFn: () => import('./components'),
  i18nNamespace: ['app-search'],
  mountsIn: opts.layoutConfig?.pluginSlotId,
  menuItems: {
    label: 'Search',
    area: [MenuItemAreaType.SearchArea, MenuItemAreaType.AppArea],
    type: MenuItemType.App,
    logo: { type: LogoTypeSource.ICON, value: 'search' },
    subRoutes: [],
  },
  routes: {
    defaultRoute: routes[RESULTS],
    [RESULTS]: routes[RESULTS],
    [ONBOARDING]: routes[ONBOARDING],
  },
});
