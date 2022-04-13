import 'systemjs-webpack-interop/auto-public-path';
import routes, { FEED, POST, REPLY, rootRoute, TAGS } from './routes';
import { LogoTypeSource } from '@akashaproject/ui-awf-typings';
import {
  IAppConfig,
  IntegrationRegistrationOptions,
  MenuItemAreaType,
  MenuItemType,
} from '@akashaproject/ui-awf-typings/lib/app-loader';

export const register: (opts: IntegrationRegistrationOptions) => IAppConfig = opts => ({
  activeWhen: (location, pathToActiveWhen) => {
    return pathToActiveWhen(rootRoute)(location);
  },
  loadingFn: () => import('./components'),
  mountsIn: opts.layoutConfig?.pluginSlotId,

  /**
   * routes that are defined here can be used by
   * other apps to navigate
   */
  routes: {
    rootRoute,
    defaultRoute: routes[FEED],
    [POST]: routes[POST],
    [TAGS]: routes[TAGS],
    [REPLY]: routes[REPLY],
  },
  title: 'Ethereum World',
  logo: { type: LogoTypeSource.ICON, value: 'appAkasha' },
  i18nNamespace: ['app-akasha-integration', 'ui-lib-feed'],
  menuItems: {
    route: rootRoute,
    label: 'Social',
    type: MenuItemType.App,
    logo: { type: LogoTypeSource.ICON, value: 'akasha' },
    area: [MenuItemAreaType.AppArea],
    subRoutes: [],
  },
  extends: [
    {
      mountsIn: 'entry-remove-confirmation',
      loadingFn: () => import('./extensions/entry-remove-modal'),
    },
    {
      mountsIn: 'editor',
      loadingFn: () => import('./extensions/editor-modal'),
    },
    {
      mountsIn: opts => {
        if (opts.extensionData && opts.extensionData.name?.startsWith('entry-card-edit-button')) {
          return opts.extensionData.name;
        }
      },
      loadingFn: () => import('./extensions/entry-edit-button'),
    },
    {
      mountsIn: opts.layoutConfig.widgetSlotId,
      activeWhen: (location, pathToActiveWhen) => {
        return pathToActiveWhen(routes[POST])(location);
      },
      loadingFn: () => import('./extensions/profile-card-widget'),
    },
  ],
});
