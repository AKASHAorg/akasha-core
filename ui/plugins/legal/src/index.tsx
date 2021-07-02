import { LogoTypeSource } from '@akashaproject/ui-awf-typings';
import routes, { rootRoute } from './routes';
import {
  IAppConfig,
  MenuItemAreaType,
  MenuItemType,
  IntegrationRegistrationOptions,
} from '@akashaproject/ui-awf-typings/lib/app-loader';

export const register: (opts: IntegrationRegistrationOptions) => IAppConfig = opts => ({
  // This is the root route in which the plugin will render.
  // Make sure to change it as it fits.
  activeWhen: (location, pathToActiveWhen) => {
    return pathToActiveWhen(rootRoute)(location);
  },
  mountsIn: opts.layoutConfig?.pluginSlotId,
  routes: {
    rootRoute,
  },
  loadingFn: () => import('./components'),
  name: 'ui-plugin-legal',
  sdkModules: [],
  title: 'Legal | Ethereum World',
  menuItems: {
    route: rootRoute,
    label: 'Legal',
    name: 'ui-plugin-legal',
    type: MenuItemType.App,
    logo: { type: LogoTypeSource.ICON, value: 'legal' },
    area: MenuItemAreaType.OtherArea,
    subRoutes: Object.keys(routes).map((routeLabel, idx) => ({
      label: routeLabel,
      index: idx,
      route: routes[routeLabel],
      type: MenuItemType.Internal,
    })),
  },
});
