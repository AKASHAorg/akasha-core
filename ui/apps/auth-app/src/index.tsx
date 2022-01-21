import routes, { rootRoute, SIGN_IN, SIGN_UP, SIGN_UP_USERNAME } from './routes';
import { LogoTypeSource } from '@akashaproject/ui-awf-typings';
import {
  IAppConfig,
  IntegrationRegistrationOptions,
} from '@akashaproject/ui-awf-typings/lib/app-loader';

export const register: (opts: IntegrationRegistrationOptions) => IAppConfig = opts => {
  return {
    activeWhen: (location, pathToActiveWhen) => {
      return pathToActiveWhen(rootRoute)(location);
    },
    loadingFn: () => import('./components'),
    mountsIn: opts.layoutConfig?.focusedPluginSlotId,
    name: 'app-auth',
    title: 'Auth',
    logo: { type: LogoTypeSource.ICON, value: 'appAuth' },
    widgets: {},
    // allow other apps to navigate to this app
    routes: {
      SIGN_IN,
      SIGN_UP,
      SIGN_UP_USERNAME,
      rootRoute,
      ...routes,
    },
    // allow other apps to find this app
    tags: ['auth', 'signin', 'signup'],
    extends: [],
  };
};
