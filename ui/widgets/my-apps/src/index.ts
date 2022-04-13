import 'systemjs-webpack-interop/auto-public-path';
import {
  IntegrationRegistrationOptions,
  IWidgetConfig,
} from '@akashaproject/ui-awf-typings/lib/app-loader';

/**
 * All widgets must export an object like this:
 */
export const register: (opts: IntegrationRegistrationOptions) => IWidgetConfig = opts => ({
  mountsIn: opts.layoutConfig?.widgetSlotId,
  loadingFn: () => import('./MyAppsWidget'),
  activeWhen: (location, pathToActiveWhen) =>
    pathToActiveWhen('/integration-center/', false)(location),
  name: 'ui-widget-my-apps',
  i18nNamespace: ['ui-widget-my-apps'],
  tags: ['my-apps', 'integration-center'],
});
