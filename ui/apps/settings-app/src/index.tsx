import 'systemjs-webpack-interop/auto-public-path';
import { rootRoute } from './routes';
import { LogoTypeSource } from '@akashaproject/ui-awf-typings';
import {
  IAppConfig,
  IntegrationRegistrationOptions,
} from '@akashaproject/ui-awf-typings/lib/app-loader';
import { I18N_NAMESPACE } from './services/constants';

export const register: (opts: IntegrationRegistrationOptions) => IAppConfig = opts => ({
  activeWhen: (location, pathToActiveWhen) => {
    return pathToActiveWhen(rootRoute)(location);
  },
  loadingFn: () => import('./components'),
  mountsIn: opts.layoutConfig?.pluginSlotId,
  name: 'app-settings',
  i18nNamespace: [I18N_NAMESPACE],
  sdkModules: [],
  // menuItems: routes,
  title: 'Settings | Ethereum World',
  logo: { type: LogoTypeSource.ICON, value: 'appSettings' },
  widgets: {},
  routes: {
    rootRoute,
  },
});
