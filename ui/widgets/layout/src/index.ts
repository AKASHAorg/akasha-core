export const application = {
  loadingFn: (): Promise<any> =>
    import(
      /* webpackChunkName: "layout" */
      /* webpackMode: "lazy" */
      './components'
    ),
  name: 'ui-widget-sidebar',
  title: 'Layout Widget',
  pluginSlotId: 'plugin-slot',
  topbarSlotId: 'topbar-slot',
  sidebarSlotId: 'sidebar-slot',
};
