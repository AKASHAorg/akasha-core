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
      /* webpackChunkName: "posts-profile-card-widget" */
      /* webpackMode: "lazy" */
      './posts-profile-card-widget'
    ),
  name: 'ui-widget-posts-profile-card',
  sdkModules: [{ module: common }, { module: profiles }, { module: posts }, { module: auth }],
};
