import 'systemjs-webpack-interop/auto-public-path';
import {
  IAppConfig,
  IntegrationRegistrationOptions,
  MenuItemAreaType,
  MenuItemType,
  LogoTypeSource,
} from '@akashaorg/typings/lib/ui';
import React from 'react';
import { SettingsIcon } from 'lucide-react';
import routes from './routes';

export const register = (opts: IntegrationRegistrationOptions): IAppConfig => ({
  rootComponent: () => import('./components'),
  i18nNamespace: ['app-settings-ewa'],
  mountsIn: opts.layoutSlots?.applicationSlotId,
  menuItems: {
    label: 'Settings',
    type: MenuItemType.App,
    area: [MenuItemAreaType.AppArea],
    logo: { type: LogoTypeSource.ICON, value: <SettingsIcon className="h-5 w-5" /> },
    subRoutes: [],
  },
  routes: {
    ...routes,
  },
});
