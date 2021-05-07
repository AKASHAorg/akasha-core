import { IWidget } from '../../../design/node_modules/@akashaproject/ui-awf-typings/lib/app-loader';

export const application: IWidget = {
  loadingFn: () => import('./components'),
  name: 'ui-widget-layout',
  pluginSlotId: 'plugin-slot',
  topbarSlotId: 'topbar-slot',
  sidebarSlotId: 'sidebar-slot',
  rootWidgetSlotId: 'root-widget-slot',
  widgetSlotId: 'widget-slot',
  modalSlotId: 'modal-slot',
};
