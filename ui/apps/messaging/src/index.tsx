import 'systemjs-webpack-interop/auto-public-path';
import { inboxRoute, rootRoute } from './routes';
import {
  IAppConfig,
  IntegrationRegistrationOptions,
  MenuItemAreaType,
  MenuItemType,
} from '@akashaorg/ui-awf-typings/lib/app-loader';
import { LogoTypeSource } from '@akashaorg/ui-awf-typings';

export const register: (opts: IntegrationRegistrationOptions) => IAppConfig = opts => ({
  activeWhen: (location, pathToActiveWhen) => {
    return pathToActiveWhen(rootRoute)(location);
  },
  loadingFn: () => import('./components'),
  mountsIn: opts.layoutConfig?.pluginSlotId,
  i18nNamespace: ['app-messaging'],
  routes: {
    rootRoute,
    inbox: inboxRoute,
  },
  extends: (match, loader) => {
    match({
      'profile-card-actions-extension': loader(() => import('./extensions/profile-message-button')),
    });
  },
  title: 'Messaging | Ethereum World',
  menuItems: {
    route: rootRoute,
    label: 'Messaging',
    type: MenuItemType.App,
    logo: { type: LogoTypeSource.ICON, value: 'inbox' },
    area: [MenuItemAreaType.AppArea],
    subRoutes: [],
  },
});
