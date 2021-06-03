import { moduleName as common } from '@akashaproject/sdk-common/lib/constants';
import { moduleName as profiles } from '@akashaproject/sdk-profiles/lib/constants';
import { moduleName as posts } from '@akashaproject/sdk-posts/lib/constants';
import { moduleName as auth } from '@akashaproject/sdk-auth/lib/constants';
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
  sdkModules: [{ module: common }, { module: posts }, { module: profiles }, { module: auth }],
};
