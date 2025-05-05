import 'systemjs-webpack-interop/auto-public-path';
import {
  IAppConfig,
  MenuItemAreaType,
  IntegrationRegistrationOptions,
  LogoTypeSource,
  IRootComponentProps,
  IPlugin,
} from '@akashaorg/typings/lib/ui';
import { NotificationPlugin } from './plugins/notification-plugin';
import React from 'react';
import { BellIcon } from 'lucide-react';

export const register = (opts: IntegrationRegistrationOptions): IAppConfig => ({
  rootComponent: () => import('./components'),
  mountsIn: opts.layoutSlots?.applicationSlotId,
  i18nNamespace: ['app-notifications'],
  menuItems: {
    label: 'Notifications',
    area: [MenuItemAreaType.AppArea],
    logo: { type: LogoTypeSource.ICON, value: <BellIcon className="h-5 w-5 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark" /> },
    subRoutes: [],
  },
  extensionPoints: [
    {
      mountsIn: 'snackbar-notif-slot',
      rootComponent: () => import('./extensions/snack-bar-notification'),
    },
    {
      mountsIn: 'topbar_notification_button',
      rootComponent: () => import('./extensions/rounded-notification-button'),
    },
  ],
});

export const registerPlugin = async (props: IRootComponentProps): Promise<IPlugin> => {
  return {
    notification: new NotificationPlugin(props),
  };
};
