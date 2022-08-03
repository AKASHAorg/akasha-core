import 'systemjs-webpack-interop/auto-public-path';
import routes, { FEED, MY_FEED, POST, REPLY, TAGS } from './routes';
import {
  IAppConfig,
  IntegrationRegistrationOptions,
  MenuItemAreaType,
  MenuItemType,
  LogoTypeSource,
} from '@akashaorg/typings/ui';

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
