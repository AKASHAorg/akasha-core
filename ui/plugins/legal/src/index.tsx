import { LogoTypeSource } from '@akashaproject/ui-awf-typings';
import routes, { rootRoute } from './routes';
import { IAppConfig } from '@akashaproject/ui-awf-typings/src/app-loader';
import { IntegrationRegistrationOptions } from '@akashaproject/ui-awf-typings/lib/app-loader';

export const register: (opts: IntegrationRegistrationOptions) => IAppConfig = opts => ({
  // This is the root route in which the plugin will render.
  // Make sure to change it as it fits.
  activeWhen: (location, pathToActiveWhen) => {
    return pathToActiveWhen(rootRoute)(location);
  },
  mountsIn: opts.layoutConfig?.pluginSlotId,
  routes: {
    rootRoute,
  },
  loadingFn: () => import('./components'),
  name: 'ui-plugin-legal',
  sdkModules: [],
  title: 'Legal | Ethereum World',
  menuItems: routes,
  logo: { type: LogoTypeSource.ICON, value: 'legal' },
});
