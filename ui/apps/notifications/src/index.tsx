import 'systemjs-webpack-interop/auto-public-path';
import {
  IAppConfig,
  MenuItemAreaType,
  IntegrationRegistrationOptions,
  LogoTypeSource,
  RootComponentProps,
} from '@akashaorg/typings/ui';
import { NotificationPlugin } from './plugins/notification-plugin';
import getSDK from '@akashaorg/awf-sdk';
export const initialize = (options: IntegrationRegistrationOptions) => {
  const notification: any = options.plugins.notification;
  const sdk = getSDK();

  if (notification && typeof notification.notify === 'function') {
    sdk.api.auth.getMessages({}).subscribe({
      next: messages => {
        notification.notify('@akashaproject/notifications', messages);
      },
      error: err => {
        options.logger.error(`Error in receiving notification messages: ${err}`);
      },
    });
  }
};

/**
 * All the plugins must export an object like this:
 */
export const register: (opts: IntegrationRegistrationOptions) => IAppConfig = opts => ({
  loadingFn: () => import('./components'),
  mountsIn: opts.layoutConfig?.pluginSlotId,
  i18nNamespace: ['app-notifications'],
  menuItems: {
    label: 'Notifications',
    area: [MenuItemAreaType.AppArea],
    logo: { type: LogoTypeSource.ICON, value: 'notifications' },
    subRoutes: [],
  },
});

export const getPlugin = async (props: RootComponentProps) => {
  return {
    notification: new NotificationPlugin(props),
  };
};
