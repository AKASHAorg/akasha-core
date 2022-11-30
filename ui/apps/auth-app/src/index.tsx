import 'systemjs-webpack-interop/auto-public-path';
import routes, { SIGN_IN, SIGN_UP, SIGN_UP_USERNAME } from './routes';
import { IAppConfig, IntegrationRegistrationOptions, LogoTypeSource } from '@akashaorg/typings/ui';

export const register: (opts: IntegrationRegistrationOptions) => IAppConfig = opts => {
  return {
    loadingFn: () => import('./components'),
    mountsIn: opts.layoutConfig?.pluginSlotId,
    i18nNamespace: ['app-auth-ewa'],
    logo: { type: LogoTypeSource.ICON, value: 'app' },
    // allow other apps to navigate to this app
    routes: {
      SIGN_IN,
      SIGN_UP,
      SIGN_UP_USERNAME,
      ...routes,
    },
    menuItems: {
      label: 'Authentication App',
      area: [],
      logo: { type: LogoTypeSource.ICON, value: 'app' },
      subRoutes: [],
    },
    // allow other apps to find this app
    tags: ['auth', 'signin', 'signup'],
  };
};
