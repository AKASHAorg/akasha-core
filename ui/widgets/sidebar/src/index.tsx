import 'systemjs-webpack-interop/auto-public-path';
import {
  IntegrationRegistrationOptions,
  IWidgetConfig,
} from '@akashaproject/ui-awf-typings/lib/app-loader';

/**
 * All widgets must export an object like this:
 */
export const register: (opts: IntegrationRegistrationOptions) => IWidgetConfig = opts => ({
  loadingFn: () => import('./components'),
  name: 'ui-widget-sidebar',
  sdkModules: [],
  title: 'Ethereum World',
  mountsIn: opts.layoutConfig?.sidebarSlotId,
});
