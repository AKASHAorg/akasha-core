import { LogoTypeSource } from '@akashaproject/ui-awf-typings';
import { rootRoute } from './routes';
import { Widget as TrendingWidget } from './trending-widget';
import { IAppConfig, MenuItemAreaType } from '@akashaproject/ui-awf-typings/lib/app-loader';

/**
 * All the plugins must export an object like this:
 */
export const register: () => IAppConfig = () => ({
  // This is the root route in which the plugin will render.
  // Make sure to change it as it fits.
  activeWhen: (location, pathToActiveWhen) => {
    return pathToActiveWhen(rootRoute)(location);
  },
  loadingFn: () => import('./components'),
  name: 'ui-plugin-notifications',
  widgets: {
    [rootRoute]: [TrendingWidget],
  },
  title: 'Notifications | Ethereum World',
  routes: {
    rootRoute,
  },
  menuItems: {
    route: rootRoute,
    label: 'Notifications',
    name: 'ui-plugin-notifications',
    area: MenuItemAreaType.QuickAccessArea,
    logo: { type: LogoTypeSource.ICON, value: 'notifications' },
  },
});
