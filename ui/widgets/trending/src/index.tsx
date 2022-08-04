import 'systemjs-webpack-interop/auto-public-path';
import { IntegrationRegistrationOptions, IWidgetConfig } from '@akashaorg/typings/ui';

/**
 * All widgets must export a register function:
 */
export const register: (opts: IntegrationRegistrationOptions) => IWidgetConfig = opts => ({
  loadingFn: () => import('./components'),
  i18nNamespace: ['ui-widget-trending'],
  mountsIn: opts.layoutConfig?.rootWidgetSlotId,
  activeWhen: () => true,
});
