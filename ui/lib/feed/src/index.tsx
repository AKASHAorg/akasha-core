import 'systemjs-webpack-interop/auto-public-path';
import { IWidgetConfig } from '@akashaproject/ui-awf-typings/lib/app-loader';
import { I18N_NAMESPACE } from './services/constants';

/**
 * All widgets must export an object like this:
 */
export const register: () => IWidgetConfig = () => ({
  loadingFn: () => import('./components'),
  name: 'ui-lib-feed',
  i18nNamespace: [I18N_NAMESPACE],
});
