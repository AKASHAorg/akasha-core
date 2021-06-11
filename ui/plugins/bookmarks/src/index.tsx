import { LogoTypeSource } from '@akashaproject/ui-awf-typings';
import { moduleName as dbModule } from '@akashaproject/sdk-db/lib/constants';
import { moduleName as auth } from '@akashaproject/sdk-auth/lib/constants';
import { moduleName as posts } from '@akashaproject/sdk-posts/lib/constants';
import { moduleName as commons } from '@akashaproject/sdk-common/lib/constants';
import { moduleName as profiles } from '@akashaproject/sdk-profiles/lib/constants';
import { rootRoute } from './routes';
import { Widget as TrendingWidget } from './trending-widget';
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
 * All apps must export an object like this:
 */
export const register: (opts: IntegrationRegistrationOptions) => IAppConfig = opts => ({
  // This is the root route in which the plugin will render.
  // Make sure to change it as it fits.
  activeWhen: (location, pathToActiveWhen) => {
    return pathToActiveWhen(rootRoute)(location);
  },
  loadingFn: () => import('./components'),
  mountsIn: opts.layoutConfig?.pluginSlotId,
  name: 'ui-plugin-bookmarks',
  widgets: {
    [rootRoute]: [TrendingWidget],
  },
  routes: {
    rootRoute,
  },
  extends: [
    {
      mountsIn: mountOptions => findTopbarQuickAccess(mountOptions.integrations),
      loadingFn: () => import('./bookmarks-topbar-button'),
    },
  ],
  sdkModules: [
    { module: dbModule },
    { module: auth },
    { module: posts },
    { module: commons },
    { module: profiles },
  ],
  title: 'Bookmarks | Ethereum World',
  logo: { type: LogoTypeSource.ICON, value: 'bookmark' },
});
