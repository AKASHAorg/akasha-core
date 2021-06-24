import { IWidgetConfig } from '@akashaproject/ui-awf-typings/lib/app-loader';

/**
 * All widgets must export an object like this:
 */
export const register: () => IWidgetConfig = () => ({
  loadingFn: () => import('./components'),
  name: 'ui-widget-login',
});
