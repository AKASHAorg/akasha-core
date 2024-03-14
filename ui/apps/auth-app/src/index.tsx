import 'systemjs-webpack-interop/auto-public-path';
import routes from './routes';
import {
  IAppConfig,
  IntegrationRegistrationOptions,
  LogoTypeSource,
} from '@akashaorg/typings/lib/ui';
import React from 'react';
import { GlobeAltIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';

export const register: (opts: IntegrationRegistrationOptions) => IAppConfig = opts => {
  return {
    loadingFn: () => import('./components'),
    mountsIn: opts.layoutConfig?.applicationSlotId,
    i18nNamespace: ['app-auth-ewa'],
    logo: { type: LogoTypeSource.ICON, value: <GlobeAltIcon /> },
    // allow other apps to navigate to this app
    routes: routes,
    menuItems: {
      label: 'Authentication App',
      area: [],
      logo: { type: LogoTypeSource.ICON, value: <GlobeAltIcon /> },
      subRoutes: [],
    },
    // allow other apps to find this app
    tags: ['auth', 'signin', 'signup'],
  };
};
