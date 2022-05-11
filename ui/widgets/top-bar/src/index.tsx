import 'systemjs-webpack-interop/auto-public-path';
import {
  IntegrationRegistrationOptions,
  IWidgetConfig,
} from '@akashaorg/ui-awf-typings/lib/app-loader';
import { extensionPointsMap } from './extension-points';
/**
 * All widgets must export an object like this:
 */
export const register: (
  opts: IntegrationRegistrationOptions,
) => IWidgetConfig = registrationOpts => {
  return {
    mountsIn: registrationOpts.layoutConfig?.topbarSlotId,
    loadingFn: () => import('./components'),
    activeWhen: () => true,
    i18nNamespace: ['ui-widget-topbar'],
    tags: ['topbar'],
    extensions: extensionPointsMap,
    extends: [
      {
        mountsIn: 'feedback',
        loadingFn: () => import('./extensions/feedback-modal'),
      },
    ],
  };
};
