import 'systemjs-webpack-interop/auto-public-path';
import routes, { BEAM, FEED, MY_FEED, PROFILE_FEED, REFLECT, TAGS } from './routes';
import {
  IAppConfig,
  IntegrationRegistrationOptions,
  LogoTypeSource,
  MenuItemAreaType,
  MenuItemType,
} from '@akashaorg/typings/lib/ui';
import React from 'react';
import { Antenna } from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';
import { Bars3BottomLeftIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';

/**
 * Initialization of the integration is optional.
 * It is called before all `register` calls but after all `getPlugin`;
 * @example Initialization an integration and triggering of a notification
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
    [BEAM]: routes[BEAM],
    [TAGS]: routes[TAGS],
    [REFLECT]: routes[REFLECT],
  },
  title: 'AKASHA World',
  logo: { type: LogoTypeSource.ICON, value: 'antenna' },
  i18nNamespace: ['app-akasha-integration', 'ui-lib-feed'],
  menuItems: {
    label: 'Antenna',
    type: MenuItemType.App,
    logo: { type: LogoTypeSource.ICON, value: <Antenna /> },
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
  contentBlocks: [
    {
      propertyType: 'slate-block',
      icon: <Bars3BottomLeftIcon />,
      displayName: 'Slate text block',
      loadingFn: () => {
        return () => import('./extensions/slate-block');
      },
    },
  ],
  extensions: [
    {
      mountsIn: 'beam-editor_*',
      loadingFn: () => import('./extensions/beam-editor'),
    },
  ],
});
