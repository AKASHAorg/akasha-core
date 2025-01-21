import 'systemjs-webpack-interop/auto-public-path';
import {
  IAppConfig,
  IntegrationRegistrationOptions,
  MenuItemAreaType,
  MenuItemType,
  LogoTypeSource,
} from '@akashaorg/typings/lib/ui';
import React from 'react';
import routes from './routes';
import { Squares2X2Icon } from '@heroicons/react/24/outline';

export const register = (opts: IntegrationRegistrationOptions): IAppConfig => ({
  mountsIn: opts.layoutSlots?.applicationSlotId,
  rootComponent: () => import('./components'),
  i18nNamespace: ['app-world-builder'],
  routes: {
    ...routes,
  },
  menuItems: {
    label: 'Vibes Console',
    type: MenuItemType.App,
    logo: { type: LogoTypeSource.ICON, value: <Squares2X2Icon /> },
    area: [MenuItemAreaType.UserAppArea],
    subRoutes: [],
  },
});
