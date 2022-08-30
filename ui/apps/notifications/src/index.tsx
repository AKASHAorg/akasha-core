import 'systemjs-webpack-interop/auto-public-path';
import {
  IAppConfig,
  MenuItemAreaType,
  IntegrationRegistrationOptions,
  LogoTypeSource,
  RootComponentProps,
} from '@akashaorg/typings/ui';
import { NotificationPlugin } from './plugins/notification-plugin';

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
