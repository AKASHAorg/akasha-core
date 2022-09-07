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
import { filter, withLatestFrom } from 'rxjs';
import { AUTH_EVENTS } from '@akashaorg/typings/sdk';
export const initialize = (options: IntegrationRegistrationOptions) => {
  const notification: any = options.plugins.notification;
  const sdk = getSDK();

  if (notification && typeof notification.notify === 'function') {
    notification.listenLogin(() => {
      const markAsRead$ = sdk.api.globalChannel.pipe(
        filter(data => data.event === AUTH_EVENTS.MARK_MSG_READ),
      );
      sdk.api.auth.getMessages({}).subscribe({
        next: msg => {
          notification.notify(
            '@akashaorg/app-notifications',
            msg.data.filter(m => !m.read),
          );
        },
        error: err => {
          options.logger.error(`Error fetching notifications: ${err}`);
        },
      });
      markAsRead$.pipe(withLatestFrom(sdk.api.auth.getMessages({}))).subscribe({
        next: ([readMsg, message]) => {
          const readMsgId = (readMsg.data as Record<string, string>).messageId;
          notification.notify(
            '@akashaorg/app-notifications',
            message.data.filter(m => !m.read && m.id !== readMsgId),
          );
        },
        error: err => {
          options.logger.error(`There was an error when trying to refetch notifications: ${err}`);
        },
      });
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
