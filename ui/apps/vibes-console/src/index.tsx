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
import routes, { HOME } from './routes';

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
    area: [MenuItemAreaType.AppArea, MenuItemAreaType.OtherArea],
    subRoutes: [
      {
        label: HOME,
        index: 0,
        route: routes[HOME],
        type: MenuItemType.Internal,
      },
    ],
  },
});
