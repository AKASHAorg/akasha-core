import { moduleName as common } from '@akashaproject/sdk-common/lib/constants';
import { IWidgetConfig } from '@akashaproject/ui-awf-typings/lib/app-loader';

/**
 * All widgets must export an object like this:
 */
export const Widget: IWidgetConfig = {
  loadingFn: () =>
    import(
      /* webpackChunkName: "newpost-terms-widget" */
      /* webpackMode: "lazy" */
      './newpost-terms-widget'
    ),
  name: 'ui-widget-newpost-terms',
  sdkModules: [{ module: common }],
};
