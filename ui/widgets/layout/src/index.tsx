import 'systemjs-webpack-interop/auto-public-path';
import {
  IntegrationRegistrationOptions,
  IWidgetConfig,
} from '@akashaproject/ui-awf-typings/lib/app-loader';

export const register: (props: IntegrationRegistrationOptions) => IWidgetConfig = () => {
  return {
    loadingFn: () => import('./components'),
    activeWhen: () => true,
    mountsIn: 'root',
    extensions: {
      pluginSlotId: 'plugin-slot',
      topbarSlotId: 'topbar-slot',
      sidebarSlotId: 'sidebar-slot',
      rootWidgetSlotId: 'root-widget-slot',
      widgetSlotId: 'widget-slot',
      modalSlotId: 'modal-slot',
      focusedPluginSlotId: 'focused-plugin-slot',
      cookieWidgetSlotId: 'cookie-widget-slot',
    },
  };
};
