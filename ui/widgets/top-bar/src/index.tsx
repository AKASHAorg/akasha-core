import { initReactI18next } from 'react-i18next';
import { moduleName as authModule } from '@akashaproject/sdk-auth/lib/constants';
import { moduleName as profilesModule } from '@akashaproject/sdk-profiles/lib/constants';
import { moduleName as commonModule } from '@akashaproject/sdk-common/lib/constants';
import { IWidget } from '@akashaproject/ui-awf-typings/lib/app-loader';

/**
 * All widgets must export an object like this:
 */
export const application: IWidget = {
  // translation config
  i18nConfig: {
    // namespaces that this plugin requires.
    // The ns is loaded automatically, you need to specify it only if changed
    // Example: i have changed the name of this plugin and the created ns was the old plugin name,
    // In this case I will preserve the old ns instead loading a possibly undefined ns.
    loadNS: [],
    // translation namespace. defaults to plugin.name
    // ns: 'ui-widget-topbar',
    // i18next.use(arr[0]).use(arr[1]).use(arr[n])
    use: [initReactI18next],
  },
  loadingFn: () => import('./components'),
  name: 'ui-widget-topbar',
  sdkModules: [{ module: commonModule }, { module: authModule }, { module: profilesModule }],
};
