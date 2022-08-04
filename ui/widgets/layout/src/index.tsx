import 'systemjs-webpack-interop/auto-public-path';
import { IntegrationRegistrationOptions, IWidgetConfig } from '@akashaorg/typings/ui';

export const register: (props: IntegrationRegistrationOptions) => IWidgetConfig = props => {
  return {
    loadingFn: () => import('./components'),
    activeWhen: () => true,
    title: props.worldConfig.title,
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
