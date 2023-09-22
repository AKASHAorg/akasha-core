import 'systemjs-webpack-interop/auto-public-path';
import {
  IntegrationRegistrationOptions,
  IWidgetConfig,
  RootComponentProps,
} from '@akashaorg/typings/lib/ui';
import { ContentBlockStore } from './plugins/content-block-store';

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
      snackbarNotifSlotId: 'snackbar-notif-slot',
    },
  };
};

export const getPlugin = (
  props: RootComponentProps & {
    encodeAppName: (name: string) => string;
    decodeAppName: (name: string) => string;
  },
) => {
  const contentBlockStore = ContentBlockStore.getInstance(props.uiEvents);
  return {
    contentBlockStore: {
      getInfos: contentBlockStore.getContentBlockInfos,
    },
  };
};
