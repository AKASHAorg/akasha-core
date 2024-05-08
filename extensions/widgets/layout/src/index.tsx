import 'systemjs-webpack-interop/auto-public-path';
import type {
  IntegrationRegistrationOptions,
  LayoutWidgetInterface,
} from '@akashaorg/typings/lib/ui';
import { TranslationPlugin } from './translation';

export const register: (props: IntegrationRegistrationOptions) => LayoutWidgetInterface = () => {
  return {
    loadingFn: () => import('./components'),
    activeWhen: () => true,
    mountsIn: 'root',
    extensionsMap: {
      applicationSlotId: 'app-slot',
      topbarSlotId: 'topbar-slot',
      sidebarSlotId: 'sidebar-slot',
      rootWidgetSlotId: 'root-widget-slot',
      widgetSlotId: 'widget-slot',
      modalSlotId: 'modal-slot',
      focusedPluginSlotId: 'focused-plugin-slot',
      cookieWidgetSlotId: 'cookie-widget-slot',
      snackbarNotifSlotId: 'snackbar-notif-slot',
    },
  };
};

/**
 *
 * export the translation's getPlugin function here
 */
export const getPlugin = async () => {
  TranslationPlugin.i18n = await TranslationPlugin.initTranslation();
  return {
    translation: {
      i18n: TranslationPlugin.i18n,
    },
  };
};
