import 'systemjs-webpack-interop/auto-public-path';
import routes, { FEED, MY_FEED, POST, REPLY, rootRoute, TAGS } from './routes';
import { LogoTypeSource } from '@akashaorg/ui-awf-typings';
import {
  IAppConfig,
  IntegrationRegistrationOptions,
  MenuItemAreaType,
  MenuItemType,
} from '@akashaorg/ui-awf-typings/lib/app-loader';

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
    [MY_FEED]: routes[MY_FEED],
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
    subRoutes: [
      {
        label: 'General',
        index: 0,
        route: routes[FEED],
        type: MenuItemType.Internal,
      },
      {
        label: MY_FEED,
        index: 1,
        route: routes[MY_FEED],
        type: MenuItemType.Internal,
      },
    ],
  },
  // extends: [
  //   {
  //     mountsIn: 'entry-remove-confirmation',
  //     loadingFn: () => import('./extensions/entry-remove-modal'),
  //   },
  //   {
  //     mountsIn: 'editor',
  //     loadingFn: () => import('./extensions/editor-modal'),
  //   },
  //   {
  //     mountsIn: opts => {
  //       if (opts.extensionData && opts.extensionData.name?.startsWith('entry-card-edit-button')) {
  //         return opts.extensionData.name;
  //       }
  //     },
  //     loadingFn: () => import('./extensions/entry-edit-button'),
  //   },
  // ],
});
