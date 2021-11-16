import { rootRoute } from './routes';
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
    sdkModules: [],
    // menuItems: routes,
    title: 'TODO: add title',
    logo: { type: LogoTypeSource.ICON, value: 'appAuth' },
    widgets: {},
    routes: {
      rootRoute,
    },
    extends: [],
  };
};
