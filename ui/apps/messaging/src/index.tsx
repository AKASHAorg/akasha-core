import 'systemjs-webpack-interop/auto-public-path';
import { chatRoute, inboxRoute, settingsRoute } from './routes';
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
  i18nNamespace: ['app-messaging'],
  routes: {
    inbox: inboxRoute,
    chat: chatRoute,
    settings: settingsRoute,
  },
  extends: (match, loader) => {
    match({
      'profile-mini-card-footer-extension': loader(
        () => import('./extensions/mini-profile-message-button'),
      ),
      'profile-card-action-extension': loader(() => import('./extensions/profile-message-button')),
    });
  },
  title: 'Messaging | Ethereum World',
  menuItems: {
    label: 'Messaging',
    type: MenuItemType.App,
    logo: { type: LogoTypeSource.ICON, value: 'email' },
    area: [MenuItemAreaType.UserAppArea],
    subRoutes: [],
  },
});
