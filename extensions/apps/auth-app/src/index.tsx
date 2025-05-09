import 'systemjs-webpack-interop/auto-public-path';
import routes from './routes';
import {
  IAppConfig,
  IntegrationRegistrationOptions,
  LogoTypeSource,
} from '@akashaorg/typings/lib/ui';
import React from 'react';
import { GlobeIcon } from 'lucide-react';

export const register = (opts: IntegrationRegistrationOptions): IAppConfig => {
  return {
    rootComponent: () => import('./components'),
    mountsIn: opts.layoutSlots?.applicationSlotId,
    i18nNamespace: ['app-auth-ewa'],
    // allow other apps to navigate to this app
    routes: routes,
    menuItems: {
      label: 'Authentication App',
      area: [],
      logo: { type: LogoTypeSource.ICON, value: <GlobeIcon className="h-5 w-5 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark" /> },
      subRoutes: [],
    },
    extensionPoints: [
      {
        mountsIn: 'topbar_login_button',
        rootComponent: () => import('./extensions/login-bolt-button'),
      },
    ],
  };
};
