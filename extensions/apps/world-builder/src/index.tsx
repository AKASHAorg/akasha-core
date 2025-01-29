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
import { Earth } from 'lucide-react';

export const register = (opts: IntegrationRegistrationOptions): IAppConfig => ({
  mountsIn: opts.layoutSlots?.applicationSlotId,
  rootComponent: () => import('./components'),
  i18nNamespace: ['app-world-builder'],
  routes: {
    ...routes,
  },
  menuItems: {
    label: 'World Builder',
    type: MenuItemType.App,
    logo: { type: LogoTypeSource.ICON, value: <Earth /> },
    area: [MenuItemAreaType.UserAppArea],
    subRoutes: [],
  },
});
