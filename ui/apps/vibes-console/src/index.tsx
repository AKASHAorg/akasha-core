import 'systemjs-webpack-interop/auto-public-path';
import {
  IAppConfig,
  IntegrationRegistrationOptions,
  MenuItemAreaType,
  MenuItemType,
  LogoTypeSource,
} from '@akashaorg/typings/lib/ui';
import React from 'react';
import { VibesConsole } from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';
import routes, { HOME, REVIEW_HUB, SETTINGS } from './routes';

export const register: (opts: IntegrationRegistrationOptions) => IAppConfig = opts => ({
  loadingFn: () => import('./components'),
  mountsIn: opts.layoutConfig?.applicationSlotId,
  logo: { type: LogoTypeSource.ICON, value: <VibesConsole /> },
  i18nNamespace: ['app-vibes-console'],
  routes: {
    ...routes,
  },
  menuItems: {
    label: 'Vibes Console',
    type: MenuItemType.App,
    logo: { type: LogoTypeSource.ICON, value: <VibesConsole /> },
    area: [MenuItemAreaType.UserAppArea, MenuItemAreaType.OtherArea],
    subRoutes: [
      {
        label: HOME,
        index: 0,
        route: routes[HOME],
        type: MenuItemType.Internal,
      },
      {
        label: REVIEW_HUB,
        index: 1,
        route: routes[REVIEW_HUB],
        type: MenuItemType.Internal,
      },
      {
        label: SETTINGS,
        index: 2,
        route: routes[SETTINGS],
        type: MenuItemType.Internal,
      },
    ],
  },
});
