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
import { filter, map, mergeMap } from 'rxjs';
import { AUTH_EVENTS } from '@akashaorg/typings/sdk';
export const initialize = (options: IntegrationRegistrationOptions) => {
  const notification: any = options.plugins['@akashaorg/app-notifications'].notification;
  const sdk = getSDK();

  if (notification && typeof notification.notify === 'function') {
    notification.listenLogin(() => {
      const markAsRead$ = sdk.api.globalChannel.pipe(
        filter(
          data =>
            data.event === AUTH_EVENTS.MARK_MSG_READ ||
            data.event === AUTH_EVENTS.NEW_NOTIFICATIONS,
        ),
      );
      // get notifications for the 1st time
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
      // listen for new notifications and for mark as read
      markAsRead$
        .pipe(
          mergeMap(() => {
            return sdk.api.auth
              .getMessages({})
              .pipe(map(newMsg => newMsg.data.filter(m => !m.read)));
          }),
        )
        .subscribe({
          next: messages => {
            notification.notify('@akashaorg/app-notifications', messages);
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
