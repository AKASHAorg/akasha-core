import 'systemjs-webpack-interop/auto-public-path';
import {
  IAppConfig,
  IntegrationRegistrationOptions,
  MenuItemAreaType,
  MenuItemType,
  LogoTypeSource,
} from '@akashaorg/typings/ui';
import routes, { HISTORY, HOME } from './routes';

export const register: (opts: IntegrationRegistrationOptions) => IAppConfig = opts => ({
  loadingFn: () => import('./components'),
  mountsIn: opts.layoutConfig?.pluginSlotId,
  logo: { type: LogoTypeSource.ICON, value: 'appModeration' },
  i18nNamespace: ['app-moderation-ewa'],
  routes: {
    ...routes,
  },
  menuItems: {
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
  extends: (matcher, loader) => {
    matcher({
      'report-modal': loader(() => import('./extensions/report-modal')),
      'moderate-modal': loader(() => import('./extensions/moderate-modal')),
    });
  },
});
