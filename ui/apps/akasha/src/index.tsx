import 'systemjs-webpack-interop/auto-public-path';
import routes, { FEED, MY_FEED, POST, PROFILE_FEED, REPLY, TAGS } from './routes';
import {
  IAppConfig,
  IntegrationRegistrationOptions,
  MenuItemAreaType,
  MenuItemType,
  LogoTypeSource,
} from '@akashaorg/typings/ui';

/**
 * Initialization of the integration is optional.
 * It is called before all `register` calls but after all `getPlugin`;
 * @example Initialization an integration and triggerin of a notification
 * ```
 * export const initialize: (opts: IntegrationInitOptions) => void = opts => {
 *  const notificationPlugin: any = opts.plugins["@akashaorg/app-notifications"].notification;
 *  if (notificationPlugin) {
 *   notificationPlugin.listenLogin(
 *     (userData: { ethAddress: string; filAddress: string; pubKey: string }) => {
 *       // user is now logged in,
 *       // we can fetch some notification data for eth address (or pubKey)
 *       // then trigger a notification
 *       notificationPlugin.notify('test_notif_domain', { message: 'This is a notification' });
 *     },
 *   );
 *  }
 * };
 * ```
 */

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
    [PROFILE_FEED]: routes[PROFILE_FEED],
    [POST]: routes[POST],
    [TAGS]: routes[TAGS],
    [REPLY]: routes[REPLY],
  },
  title: 'Akasha World',
  logo: { type: LogoTypeSource.ICON, value: 'antenna' },
  i18nNamespace: ['app-akasha-integration', 'ui-lib-feed'],
  menuItems: {
    label: 'Antenna',
    type: MenuItemType.App,
    logo: { type: LogoTypeSource.ICON, value: 'antenna' },
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
      'inline-editor_*': loader(() => import('./extensions/inline-editor')),
      'entry-card-edit-button_*': loader(() => import('./extensions/entry-edit-button')),
    });
  },
});
