import 'systemjs-webpack-interop/auto-public-path';
import { IntegrationRegistrationOptions, WidgetInterface } from '@akashaorg/typings/lib/ui';
/**
 * All widgets must export an object like this:
 */
export const register: (opts: IntegrationRegistrationOptions) => WidgetInterface = opts => {
  return {
    mountsIn: opts.layoutConfig.cookieWidgetSlotId,
    loadingFn: () => import('./components'),
    activeWhen: () => true,
  };
};
