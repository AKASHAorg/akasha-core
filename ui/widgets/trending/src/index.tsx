import 'systemjs-webpack-interop/auto-public-path';
import { IntegrationRegistrationOptions, WidgetInterface } from '@akashaorg/typings/lib/ui';

/**
 * All widgets must export a register function:
 */
export const register: (opts: IntegrationRegistrationOptions) => WidgetInterface = opts => ({
  loadingFn: () => import('./components'),
  mountsIn: opts.layoutConfig?.rootWidgetSlotId,
  activeWhen: () => true,
});
