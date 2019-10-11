export default {
  loadingFn: (): Promise<any> => import('./components'),
  name: 'ui-widget-sidebar',
  title: 'Layout Widget',
  pluginSlotId: 'plugin-slot',
  appBarSlotId: 'appbar-slot',
  sidebarSlotId: 'sidebar-slot',
};
