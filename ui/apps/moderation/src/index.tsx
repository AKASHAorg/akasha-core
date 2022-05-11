import 'systemjs-webpack-interop/auto-public-path';
import routes, { HISTORY, HOME, rootRoute } from './routes';
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
  mountsIn: opts.layoutConfig?.pluginSlotId,
  logo: { type: LogoTypeSource.ICON, value: 'appModeration' },
  i18nNamespace: ['app-moderation-ewa'],
  routes: {
    rootRoute,
    [HOME]: routes[HOME],
    [HISTORY]: routes[HISTORY],
  },
  menuItems: {
    route: rootRoute,
    label: 'Moderating',
    type: MenuItemType.App,
    logo: { type: LogoTypeSource.ICON, value: 'appModeration' },
    area: [MenuItemAreaType.AppArea, MenuItemAreaType.OtherArea],
    subRoutes: [
      {
        label: HISTORY,
        index: 1,
        route: routes[HISTORY],
        type: MenuItemType.Internal,
      },
      {
        label: HOME,
        index: 0,
        route: routes[HOME],
        type: MenuItemType.Internal,
      },
    ],
  },
  extends: [
    {
      mountsIn: 'report-modal',
      loadingFn: () => import('./extensions/report-modal'),
    },
    {
      mountsIn: 'moderate-modal',
      loadingFn: () => import('./extensions/moderate-modal'),
    },
  ],
});
