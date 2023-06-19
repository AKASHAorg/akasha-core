import 'systemjs-webpack-interop/auto-public-path';
import {
  IAppConfig,
  MenuItemAreaType,
  IntegrationRegistrationOptions,
  LogoTypeSource,
} from '@akashaorg/typings/ui';
import routes from './routes';

/**
 * All the plugins must export an object like this:
 */
export const register: (opts: IntegrationRegistrationOptions) => IAppConfig = opts => ({
  mountsIn: opts.layoutConfig?.pluginSlotId,
  routes: {
    ...routes,
  },
  i18nNamespace: ['app-akasha-verse'],
  loadingFn: () => import('./components'),
  title: 'App center',
  menuItems: {
    label: 'AKASHAVerse',
    area: [MenuItemAreaType.AppArea],
    logo: { type: LogoTypeSource.ICON, value: 'appCenter' },
    subRoutes: [],
  },
  extends: (matcher, loader) => {
    matcher({
      'install-app': loader(() => import('./extensions/install-app')),
    });
  },
});
