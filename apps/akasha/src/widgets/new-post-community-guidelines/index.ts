import { IWidgetConfig } from '@akashaproject/ui-awf-typings/lib/app-loader';

/**
 * All widgets must export an object like this:
 */
export const Widget: IWidgetConfig = {
  loadingFn: () =>
    import(
      /* webpackChunkName: "newpost-community-widget" */
      /* webpackMode: "lazy" */
      './newpost-community-widget'
    ),
  name: 'ui-widget-newpost-community',
  sdkModules: [],
};
