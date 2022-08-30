import 'systemjs-webpack-interop/auto-public-path';
import routes, { FEED, MY_FEED, POST, REPLY, TAGS } from './routes';
import {
  IAppConfig,
  IntegrationRegistrationOptions,
  MenuItemAreaType,
  MenuItemType,
  LogoTypeSource,
  IntegrationInitOptions,
} from '@akashaorg/typings/ui';

/**
 * Example of initialization and triggerin of a notification
 */

// export const initialize: (opts: IntegrationInitOptions) => void = opts => {
//   const notificationPlugin: any = opts.plugins.notification;
//   if (notificationPlugin) {
//     notificationPlugin.listenLogin(
//       (userData: { ethAddress: string; filAddress: string; pubKey: string }) => {
//         // user is now logged in,
//         // we can fetch some notification data for eth address (or pubKey)
//         // then trigger a notification
//         notificationPlugin.notify('test_notif_domain', { message: 'This is a notification' });
//       },
//     );
//   }
// };

export const register: (opts: IntegrationRegistrationOptions) => IAppConfig = opts => ({
  loadingFn: () => import('./components'),
  mountsIn: opts.layoutConfig?.pluginSlotId,

  /**
   * routes that are defined here can be used by
   * other apps to navigate
   */
  routes: {
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
  extends: (matcher, loader) => {
    matcher({
      'entry-remove-confirmation': loader(() => import('./extensions/entry-remove-modal')),
      'editor-modal': loader(() => import('./extensions/editor-modal')),
      'entry-card-edit-button_*': loader(() => import('./extensions/entry-edit-button')),
    });
  },
});
