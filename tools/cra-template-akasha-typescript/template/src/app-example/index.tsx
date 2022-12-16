import 'systemjs-webpack-interop/auto-public-path';
import {
  IntegrationRegistrationOptions,
  MenuItemAreaType,
  MenuItemType,
  LogoTypeSource,
} from '@akashaorg/typings/ui';
import routes, { Example } from './routes';

export const register = (options: IntegrationRegistrationOptions) => ({
  activeWhen: (location, pathToActiveWhen) =>
    pathToActiveWhen('/@akashaorg/app-example', false)(location),
  loadingFn: () => import('./components'),
  mountsIn: options.layoutConfig?.pluginSlotId || '',
  i18nNamespace: ['app-example'],
  routes: {
    defaultRoute: routes[Example],
  },
  title: 'Home',
  logo: { type: LogoTypeSource.ICON, value: 'appAkasha' },
  menuItems: {
    label: 'Example',
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
