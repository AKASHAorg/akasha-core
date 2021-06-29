import { IWidgetConfig } from '@akashaproject/ui-awf-typings/lib/app-loader';

/**
 * All widgets must export an object like this:
 */
export const Widget: IWidgetConfig = {
  loadingFn: () =>
    import(
      /* webpackChunkName: "trending-widget" */
      /* webpackMode: "lazy" */
      './widget'
    ),
  name: 'ui-widget-trending',
};
