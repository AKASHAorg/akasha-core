import { initReactI18next } from 'react-i18next';
import { moduleName as common } from '@akashaproject/sdk-common/lib/constants';
import { IWidget } from '@akashaproject/ui-awf-typings/lib/app-loader';

/**
 * All widgets must export an object like this:
 */
export const Widget: IWidget = {
  // translation config
  i18nConfig: {
    // namespaces that this plugin requires.
    // The ns is loaded automatically, you need to specify it only if changed
    // Example: i have changed the name of this plugin and the created ns was the old plugin name,
    // In this case I will preserve the old ns instead loading a possibly undefined ns.
    loadNS: [],
    // translation namespace. defaults to plugin.name
    // ns: 'ui-widget-sidebar',
    // i18next.use(arr[0]).use(arr[1]).use(arr[n])
    use: [initReactI18next],
  },
  loadingFn: () =>
    import(
      /* webpackChunkName: "trending-widget" */
      /* webpackMode: "lazy" */
      './trending-widget'
    ),
  name: 'ui-widget-trending',
  sdkModules: [{ module: common }],
};
