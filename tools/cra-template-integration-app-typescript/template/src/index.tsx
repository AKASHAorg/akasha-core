import {
  IntegrationRegistrationOptions,
  MenuItemAreaType,
  MenuItemType,
  LogoTypeSource,
} from '@akashaorg/typings/ui';
import 'systemjs-webpack-interop/auto-public-path';
import routes, { Landing } from './routes';

export const register = (options: IntegrationRegistrationOptions) => ({
  activeWhen: (location, pathToActiveWhen) => {
    return pathToActiveWhen('/@akashaorg/app-landing', false)(location);
  },
  loadingFn: () => import('./components'),
  mountsIn: options.layoutConfig?.pluginSlotId,
  i18nNamespace: ['app-landing'],
  routes: {
    defaultRoute: routes[Landing],
  },
  title: 'Home',
  logo: { type: LogoTypeSource.ICON, value: 'appAkasha' },
  menuItems: {
    label: 'Landing',
    type: MenuItemType.App,
    logo: { type: LogoTypeSource.ICON, value: 'akasha' },
    area: [MenuItemAreaType.AppArea],
    subRoutes: [],
  },
  extends: (matcher, loader) => {
    matcher({
      'app-extension': loader(() => import('./extensions/app-extension')),
    });
  },
});
