import 'systemjs-webpack-interop/auto-public-path';
import { LogoTypeSource } from '@akashaproject/ui-awf-typings';
import {
  IAppConfig,
  MenuItemAreaType,
  IntegrationRegistrationOptions,
} from '@akashaproject/ui-awf-typings/lib/app-loader';
import { rootRoute } from './routes';

/**
 * All the plugins must export an object like this:
 */
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
  i18nNamespace: ['app-integration-center'],
  loadingFn: () => import('./components'),
  title: 'App center',
  menuItems: {
    label: 'Integration Center',
    name: 'app-integration-center',
    area: [MenuItemAreaType.QuickAccessArea, MenuItemAreaType.AppArea],
    logo: { type: LogoTypeSource.ICON, value: 'appCenter' },
    route: rootRoute,
    subRoutes: [],
  },
  extends: [
    {
      mountsIn: opts.layoutConfig.widgetSlotId,
      activeWhen: (location, pathToActiveWhen) => {
        return pathToActiveWhen(rootRoute)(location);
      },
      loadingFn: () => import('./extensions/integrations-widget'),
    },
  ],
});
