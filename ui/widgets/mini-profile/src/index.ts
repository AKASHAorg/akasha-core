import 'systemjs-webpack-interop/auto-public-path';
import {
  IntegrationRegistrationOptions,
  IWidgetConfig,
} from '@akashaorg/ui-awf-typings/lib/app-loader';

/**
 * All widgets must export an object like this:
 */
export const register: (opts: IntegrationRegistrationOptions) => IWidgetConfig = opts => ({
  mountsIn: opts.layoutConfig?.widgetSlotId,
  loadingFn: () => import('./MiniProfileWidget'),
  activeWhen: (location, pathToActiveWhen) =>
    pathToActiveWhen('/social-app/post/', false)(location),
  name: 'ui-widget-mini-profile',
  i18nNamespace: ['ui-widget-mini-profile'],
  tags: ['mini-profile'],
});
