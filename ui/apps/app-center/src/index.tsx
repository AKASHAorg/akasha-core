import 'systemjs-webpack-interop/auto-public-path';
import { LogoTypeSource } from '@akashaorg/ui-awf-typings';
import {
  IAppConfig,
  MenuItemAreaType,
  IntegrationRegistrationOptions,
} from '@akashaorg/ui-awf-typings/lib/app-loader';
import routes from './routes';

/**
 * All the plugins must export an object like this:
 */
export const register: (opts: IntegrationRegistrationOptions) => IAppConfig = opts => ({
  mountsIn: opts.layoutConfig?.pluginSlotId,
  routes: {
    ...routes,
  },
  i18nNamespace: ['app-integration-center'],
  loadingFn: () => import('./components'),
  title: 'App center',
  menuItems: {
    label: 'Integration Center',
    area: [MenuItemAreaType.AppArea],
    logo: { type: LogoTypeSource.ICON, value: 'appCenter' },
    subRoutes: [],
  },
  extends: (matcher, loader) => {
    matcher({
      'install-modal': loader(() => import('./extensions/install-modal')),
    });
  },
});
