export const application = {
  loadingFn: (): Promise<any> => import('./components'),
  name: 'ui-widget-layout',
  title: 'Ethereum World',
  pluginSlotId: 'plugin-slot',
  topbarSlotId: 'topbar-slot',
  sidebarSlotId: 'sidebar-slot',
  rootWidgetSlotId: 'root-widget-slot',
  widgetSlotId: 'widget-slot',
  modalSlotId: 'modal-slot',
};
