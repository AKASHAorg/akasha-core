import { LogoTypeSource } from '@akashaproject/ui-awf-typings';
import routes, { rootRoute } from './routes';
import { moduleName as profilesModule } from '@akashaproject/sdk-profiles/lib/constants';
import { moduleName as commonsModule } from '@akashaproject/sdk-common/lib/constants';
import { moduleName as authModule } from '@akashaproject/sdk-auth/lib/constants';
import { moduleName as registryModule } from '@akashaproject/sdk-registry/lib/constants';
import { moduleName as postsModule } from '@akashaproject/sdk-posts/lib/constants';
import { moduleName as dbModule } from '@akashaproject/sdk-db/lib/constants';
import {
  IAppConfig,
  IntegrationRegistrationOptions,
  IWidgetConfig,
} from '@akashaproject/ui-awf-typings/src/app-loader';

const findTopbarQuickAccess = (integrations: IntegrationRegistrationOptions['integrations']) => {
  if (!integrations) {
    return null;
  }
  const topbarConf = Object.entries(integrations.configs).find(intConf => {
    const [, config] = intConf as [string, IAppConfig | IWidgetConfig];
    if (config.tags && config.tags.includes('topbar')) {
      return true;
    }
    return false;
  });
  if (topbarConf) {
    const [, config] = topbarConf as [string, IAppConfig | IWidgetConfig];
    if (config.extensions) {
      return config.extensions.QuickAccess;
    }
    return null;
  }
  return null;
};

/**
 * All the plugins must export an object like this:
 */
export const register: (opts: IntegrationRegistrationOptions) => IAppConfig = opts => ({
  // This is the root route in which the plugin will render.
  // Make sure to change it as it fits.
  activeWhen: (location, pathToActiveWhen) => {
    return pathToActiveWhen(rootRoute)(location);
  },
  mountsIn: opts.layoutConfig?.pluginSlotId,
  loadingFn: () => import('./components'),
  name: 'ui-plugin-profile',
  sdkModules: [
    { module: profilesModule },
    { module: commonsModule },
    { module: authModule },
    { module: registryModule },
    { module: postsModule },
    { module: dbModule },
  ],
  title: 'Profile | Ethereum World',
  menuItems: routes,
  logo: { type: LogoTypeSource.AVATAR, value: '' },
  extends: [
    {
      mountsIn: mountOptions => findTopbarQuickAccess(mountOptions.integrations),
      loadingFn: () => import('./extensions/sign-in-buttons'),
    },
    {
      mountsIn: 'signin',
      loadingFn: () => import('./extensions/sign-in-modal'),
    },
  ],
  routes: {
    rootRoute,
  },
});
