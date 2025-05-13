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
import '../main.css';

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
    logo: {
      type: LogoTypeSource.ICON,
      value: (
        <Earth className="h-5 w-5 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark" />
      ),
    },
    area: [MenuItemAreaType.UserAppArea],
    subRoutes: [],
  },
});
