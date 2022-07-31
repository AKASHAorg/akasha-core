import 'systemjs-webpack-interop/auto-public-path';
import routes from './routes';
import { LogoTypeSource } from '@akashaorg/ui-awf-typings';
import {
  IAppConfig,
  IntegrationRegistrationOptions,
  MenuItemAreaType,
  MenuItemType,
} from '@akashaorg/ui-awf-typings/lib/app-loader';

export const register: (opts: IntegrationRegistrationOptions) => IAppConfig = opts => ({
  loadingFn: () => import('./components'),
  i18nNamespace: ['app-settings-ewa'],
  mountsIn: opts.layoutConfig?.pluginSlotId,
  logo: { type: LogoTypeSource.ICON, value: 'settingsAlt' },
  menuItems: {
    label: 'Settings',
    type: MenuItemType.App,
    area: [MenuItemAreaType.AppArea],
    logo: { type: LogoTypeSource.ICON, value: 'settingsAlt' },
    subRoutes: [],
  },
  routes: {
    ...routes,
  },
});
