import 'systemjs-webpack-interop/auto-public-path';
import { IntegrationRegistrationOptions, WidgetInterface } from '@akashaorg/typings/lib/ui';
import { extensionPointsMap } from './extension-points';
/**
 * All widgets must export an object like this:
 */
export const register: (
  opts: IntegrationRegistrationOptions,
) => WidgetInterface = registrationOpts => {
  return {
    mountsIn: registrationOpts.layoutConfig?.topbarSlotId,
    loadingFn: () => import('./components'),
    activeWhen: () => true,
    extensionsMap: extensionPointsMap,
  };
};
