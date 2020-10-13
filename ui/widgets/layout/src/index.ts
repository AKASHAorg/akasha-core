// chunkName must be unique among packages
export const application = {
  loadingFn: (): Promise<any> =>
    import(
      /* webpackChunkName: "layoutChunk" */
      /* webpackMode: "lazy" */
      './components'
    ),
  name: 'ui-widget-layout',
  title: 'Layout Widget',
  pluginSlotId: 'plugin-slot',
  topbarSlotId: 'topbar-slot',
  rootWidgetSlotId: 'root-widget-slot',
  widgetSlotId: 'widget-slot',
  modalSlotId: 'modal-slot',
};
