import 'systemjs-webpack-interop/auto-public-path';
import {
  IAppConfig,
  IntegrationRegistrationOptions,
  MenuItemAreaType,
  MenuItemType,
  LogoTypeSource,
} from '@akashaorg/typings/ui';

/**
 * All apps must export an object like this:
 */
export const register: (opts: IntegrationRegistrationOptions) => IAppConfig = opts => ({
  loadingFn: () => import('./components'),
  mountsIn: opts.layoutConfig?.pluginSlotId,
  i18nNamespace: ['app-bookmarks'],
  extends: (matchExtensionPoint, loadingHandler) => {
    matchExtensionPoint({
      'entry-card-actions-right_*': loadingHandler(
        () => import('./extensions/entry-card-save-button'),
      ),
    });
  },
  title: 'Bookmarks | Ethereum World',
  menuItems: {
    label: 'Bookmarks',
    type: MenuItemType.App,
    logo: { type: LogoTypeSource.ICON, value: 'bookmark' },
    area: [MenuItemAreaType.AppArea],
    subRoutes: [],
  },
});
