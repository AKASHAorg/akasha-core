import 'systemjs-webpack-interop/auto-public-path';
import {
  IAppConfig,
  IntegrationRegistrationOptions,
  MenuItemAreaType,
  MenuItemType,
  LogoTypeSource,
} from '@akashaorg/typings/lib/ui';
import React from 'react';
import { Vibe } from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';
import routes, { DASHBOARD, HISTORY, HOME, MODERATORS } from './routes';

export const register: (opts: IntegrationRegistrationOptions) => IAppConfig = opts => ({
  loadingFn: () => import('./components'),
  mountsIn: opts.layoutConfig?.pluginSlotId,
  logo: { type: LogoTypeSource.ICON, value: <Vibe /> },
  i18nNamespace: ['app-moderation-ewa'],
  routes: {
    ...routes,
  },
  menuItems: {
    label: 'Vibe',
    type: MenuItemType.App,
    logo: { type: LogoTypeSource.ICON, value: <Vibe /> },
    area: [MenuItemAreaType.AppArea, MenuItemAreaType.OtherArea],
    subRoutes: [
      {
        label: HOME,
        index: 0,
        route: routes[HOME],
        type: MenuItemType.Internal,
      },
      {
        label: DASHBOARD,
        index: 1,
        route: routes[DASHBOARD],
        type: MenuItemType.Internal,
      },
      {
        label: MODERATORS,
        index: 2,
        route: routes[MODERATORS],
        type: MenuItemType.Internal,
      },
      {
        label: HISTORY,
        index: 3,
        route: routes[HISTORY],
        type: MenuItemType.Internal,
      },
    ],
  },
});
