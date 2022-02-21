import 'systemjs-webpack-interop/auto-public-path';
import {
  IntegrationRegistrationOptions,
  IWidgetConfig,
} from '@akashaproject/ui-awf-typings/lib/app-loader';
import { I18N_NAMESPACE } from './services/constants';

/**
 * All widgets must export a register function:
 */
export const register: (opts: IntegrationRegistrationOptions) => IWidgetConfig = opts => ({
  loadingFn: () => import('./components'),
  name: 'ui-widget-trending',
  i18nNamespace: [I18N_NAMESPACE],
  mountsIn: opts.layoutConfig?.rootWidgetSlotId,
});
