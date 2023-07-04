import 'systemjs-webpack-interop/auto-public-path';
import { IntegrationRegistrationOptions, IWidgetConfig } from '@akashaorg/typings/ui';

/**
 * All widgets must export an object like this:
 */
export const register: (opts: IntegrationRegistrationOptions) => IWidgetConfig = opts => ({
  mountsIn: opts.layoutConfig?.sidebarSlotId,
  loadingFn: () => import('./sidebar'),
  activeWhen: () => true,
  name: 'ui-widget-sidebar',
  i18nNamespace: ['ui-widget-sidebar'],
  tags: ['sidebar'],
});
