import { moduleName as auth } from '@akashaproject/sdk-auth/lib/constants';
import { moduleName as common } from '@akashaproject/sdk-common/lib/constants';
import { IWidgetConfig } from '@akashaproject/ui-awf-typings/lib/app-loader';

/**
 * All widgets must export an object like this:
 */
export const register: () => IWidgetConfig = () => ({
  loadingFn: () => import('./components'),
  name: 'ui-widget-login',
  sdkModules: [{ module: auth }, { module: common }],
});
