import 'systemjs-webpack-interop/auto-public-path';
import {
  IntegrationRegistrationOptions,
  IWidgetConfig,
} from '@akashaproject/ui-awf-typings/lib/app-loader';

/**
 * All widgets must export a register function:
 */
export const register: (opts: IntegrationRegistrationOptions) => IWidgetConfig = opts => ({
  loadingFn: () => import('./components'),
  name: 'ui-widget-trending',
  mountsIn: opts.layoutConfig?.rootWidgetSlotId,
});
