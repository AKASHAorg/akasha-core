import 'systemjs-webpack-interop/auto-public-path';
import { IntegrationRegistrationOptions, IWidgetConfig } from '@akashaorg/typings/ui';

/**
 * All widgets must export an object like this:
 */
export const register: (opts: IntegrationRegistrationOptions) => IWidgetConfig = opts => ({
  mountsIn: opts.layoutConfig?.widgetSlotId,
  loadingFn: () => import('./mini-profile-widget'),
  activeWhen: (location, pathToActiveWhen) => {
    return pathToActiveWhen('/@akashaorg/app-akasha-integration/post/', false)(location);
  },
  name: 'ui-widget-mini-profile',
  i18nNamespace: [],
  tags: ['mini-profile'],
});
