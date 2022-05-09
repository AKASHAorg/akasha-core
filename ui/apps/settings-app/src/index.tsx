import 'systemjs-webpack-interop/auto-public-path';
import routes, { rootRoute } from './routes';
import { LogoTypeSource } from '@akashaorg/ui-awf-typings';
import {
  IAppConfig,
  IntegrationRegistrationOptions,
  MenuItemAreaType,
  MenuItemType,
} from '@akashaorg/ui-awf-typings/lib/app-loader';

export const register: (opts: IntegrationRegistrationOptions) => IAppConfig = opts => ({
  activeWhen: (location, pathToActiveWhen) => {
    return pathToActiveWhen(rootRoute)(location);
  },
  loadingFn: () => import('./components'),
  i18nNamespace: ['app-settings-ewa'],
  mountsIn: opts.layoutConfig?.pluginSlotId,
  logo: { type: LogoTypeSource.ICON, value: 'settingsAlt' },
  menuItems: {
    label: 'Settings',
    type: MenuItemType.App,
    area: [MenuItemAreaType.AppArea],
    logo: { type: LogoTypeSource.ICON, value: 'settingsAlt' },
    route: rootRoute,
    subRoutes: [],
  },
  routes: {
    rootRoute,
    ...routes,
  },
});
