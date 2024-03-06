import 'systemjs-webpack-interop/auto-public-path';
import {
  IAppConfig,
  IntegrationRegistrationOptions,
  MenuItemAreaType,
  MenuItemType,
  LogoTypeSource,
} from '@akashaorg/typings/lib/ui';
import React from 'react';
import { Akasha } from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';
import routes, { HOME, REVIEW_HUB, SETTINGS } from './routes';

export const register: (opts: IntegrationRegistrationOptions) => IAppConfig = opts => ({
  loadingFn: () => import('./components'),
  mountsIn: opts.layoutConfig?.pluginSlotId,
  logo: { type: LogoTypeSource.ICON, solidIcon: true, value: <Akasha /> },
  i18nNamespace: ['app-vibes-console'],
  routes: {
    ...routes,
  },
  menuItems: {
    label: 'Vibes Console',
    type: MenuItemType.App,
    logo: { type: LogoTypeSource.ICON, solidIcon: true, value: <Akasha /> },
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
