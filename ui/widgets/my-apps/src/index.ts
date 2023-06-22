import 'systemjs-webpack-interop/auto-public-path';
import { IntegrationRegistrationOptions, IWidgetConfig } from '@akashaorg/typings/ui';

/**
 * All widgets must export an object like this:
 */
export const register: (opts: IntegrationRegistrationOptions) => IWidgetConfig = opts => ({
  mountsIn: opts.layoutConfig?.widgetSlotId,
  loadingFn: () => import('./my-apps-widget'),
  activeWhen: (location, pathToActiveWhen) =>
    pathToActiveWhen('/@akashaorg/app-akasha-verse/', false)(location),
  name: 'ui-widget-my-apps',
  i18nNamespace: [],
});
