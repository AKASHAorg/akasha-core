import {
  IntegrationRegistrationOptions,
  IWidgetConfig,
} from '@akashaproject/ui-awf-typings/lib/app-loader';

import { moduleName as authModule } from '@akashaproject/sdk-auth/lib/constants';
import { moduleName as commonModule } from '@akashaproject/sdk-common/lib/constants';
import { moduleName as profilesModule } from '@akashaproject/sdk-profiles/lib/constants';
import { moduleName as posts } from '@akashaproject/sdk-posts/lib/constants';

/**
 * All widgets must export a register function:
 */
export const register: (opts: IntegrationRegistrationOptions) => IWidgetConfig = opts => ({
  loadingFn: () => import('./components'),
  name: 'ui-widget-trending',
  mountsIn: opts.layoutConfig.rootWidgetSlotId,
  sdkModules: [
    { module: authModule },
    { module: commonModule },
    { module: profilesModule },
    { module: posts },
  ],
});
