import { moduleName as authModule } from '@akashaproject/sdk-auth/lib/constants';
import { moduleName as profilesModule } from '@akashaproject/sdk-profiles/lib/constants';
import { moduleName as commonModule } from '@akashaproject/sdk-common/lib/constants';
import {
  IWidgetConfig,
  IntegrationRegistrationOptions,
} from '@akashaproject/ui-awf-typings/lib/app-loader';
import { extensionPointsMap } from './extension-points';
/**
 * All widgets must export an object like this:
 */
export const register: (
  opts: IntegrationRegistrationOptions,
) => IWidgetConfig = registrationOpts => {
  return {
    mountsIn: registrationOpts.layoutConfig.topbarSlotId,
    loadingFn: () => import('./components'),
    name: 'ui-widget-topbar',
    tags: ['topbar'],
    sdkModules: [{ module: commonModule }, { module: authModule }, { module: profilesModule }],
    extensions: extensionPointsMap,
  };
};
