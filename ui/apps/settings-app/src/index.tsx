import 'systemjs-webpack-interop/auto-public-path';
import { rootRoute } from './routes';
import { LogoTypeSource } from '@akashaproject/ui-awf-typings';
import {
  IAppConfig,
  IntegrationRegistrationOptions,
  MenuItemAreaType,
  MenuItemType,
} from '@akashaproject/ui-awf-typings/lib/app-loader';

export const register: (opts: IntegrationRegistrationOptions) => IAppConfig = opts => ({
  activeWhen: (location, pathToActiveWhen) => {
    return pathToActiveWhen(rootRoute)(location);
  },
  loadingFn: () => import('./components'),
  i18nNamespace: ['app-settings-ewa'],
  mountsIn: opts.layoutConfig?.pluginSlotId,
  logo: { type: LogoTypeSource.ICON, value: 'appSettings' },
  menuItems: {
    label: 'Settings',
    type: MenuItemType.App,
    area: [MenuItemAreaType.OtherArea, MenuItemAreaType.AppArea],
    logo: { type: LogoTypeSource.ICON, value: 'appSettings' },
    route: rootRoute,
    subRoutes: [],
  },
  routes: {
    rootRoute,
  },
});
