import { moduleName as common } from '@akashaproject/sdk-common/lib/constants';
import { IWidgetConfig } from '@akashaproject/ui-awf-typings/lib/app-loader';

/**
 * All widgets must export an object like this:
 */
export const Widget: IWidgetConfig = {
  loadingFn: () =>
    import(
      /* webpackChunkName: "newpost-wohoo-widget" */
      /* webpackMode: "lazy" */
      './newpost-wohoo-widget'
    ),
  name: 'ui-widget-newpost-wohoo',
  sdkModules: [{ module: common }],
};
