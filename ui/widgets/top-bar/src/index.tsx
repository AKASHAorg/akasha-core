import 'systemjs-webpack-interop/auto-public-path';
import {
  IWidgetConfig,
  IntegrationRegistrationOptions,
} from '@akashaproject/ui-awf-typings/lib/app-loader';
import { extensionPointsMap } from './extension-points';
import { I18N_NAMESPACE } from './services/constants';
/**
 * All widgets must export an object like this:
 */
export const register: (
  opts: IntegrationRegistrationOptions,
) => IWidgetConfig = registrationOpts => {
  return {
    mountsIn: registrationOpts.layoutConfig?.topbarSlotId,
    loadingFn: () => import('./components'),
    name: 'ui-widget-topbar',
    i18nNamespace: [I18N_NAMESPACE],
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
