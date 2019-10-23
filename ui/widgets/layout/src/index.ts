export default {
  loadingFn: (): Promise<any> => import('./components'),
  name: 'ui-widget-sidebar',
  title: 'Layout Widget',
  pluginSlotId: 'plugin-slot',
  topbarSlotId: 'topbar-slot',
  sidebarSlotId: 'sidebar-slot',
};
