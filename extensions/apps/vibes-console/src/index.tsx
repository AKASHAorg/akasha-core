import 'systemjs-webpack-interop/auto-public-path';
import {
  IAppConfig,
  IntegrationRegistrationOptions,
  MenuItemAreaType,
  MenuItemType,
  LogoTypeSource,
} from '@akashaorg/typings/lib/ui';
import React from 'react';
import routes, { HOME, DASHBOARD } from './routes';
import { SquareSquareIcon } from 'lucide-react';

export const register = (opts: IntegrationRegistrationOptions): IAppConfig => ({
  rootComponent: () => import('./components'),
  mountsIn: opts.layoutSlots?.applicationSlotId,
  i18nNamespace: ['app-vibes-console'],
  routes: {
    ...routes,
  },
  menuItems: {
    label: 'Vibes Console',
    type: MenuItemType.App,
    logo: { type: LogoTypeSource.ICON, value: <SquareSquareIcon className="h-5 w-5 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark" /> },
    area: [MenuItemAreaType.UserAppArea],
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
    ],
  },
});
