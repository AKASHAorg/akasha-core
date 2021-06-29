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
};
