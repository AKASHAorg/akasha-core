import 'systemjs-webpack-interop/auto-public-path';
import {
  IWidgetConfig,
  IntegrationRegistrationOptions,
} from '@akashaproject/ui-awf-typings/lib/app-loader';
import { I18N_NAMESPACE } from './services/constants';
/**
 * All widgets must export an object like this:
 */
export const register: (opts: IntegrationRegistrationOptions) => IWidgetConfig = opts => {
  return {
    mountsIn: opts.layoutConfig.cookieWidgetSlotId,
    loadingFn: () => import('./components'),
    name: 'ui-widget-analytics',
    i18nNamespace: [I18N_NAMESPACE],
    tags: ['analytics-widget'],
  };
};
