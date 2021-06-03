import { LogoTypeSource } from '@akashaproject/ui-awf-typings';
import { moduleName as authModule } from '@akashaproject/sdk-auth/lib/constants';
import { moduleName as profilesModule } from '@akashaproject/sdk-profiles/lib/constants';
import { moduleName as commonModule } from '@akashaproject/sdk-common/lib/constants';
import { rootRoute } from './routes';
import { Widget as TrendingWidget } from './trending-widget';
import { IAppConfig } from '@akashaproject/ui-awf-typings/src/app-loader';

/**
 * All the plugins must export an object like this:
 */
export const register: () => IAppConfig = () => ({
  // This is the root route in which the plugin will render.
  // Make sure to change it as it fits.
  activeWhen: (location, pathToActiveWhen) => {
    return pathToActiveWhen(rootRoute)(location);
  },
  loadingFn: () => import('./components'),
  name: 'ui-plugin-notifications',
  widgets: {
    [rootRoute]: [TrendingWidget],
  },
  sdkModules: [{ module: commonModule }, { module: authModule }, { module: profilesModule }],
  title: 'Notifications | Ethereum World',
  logo: { type: LogoTypeSource.ICON, value: 'notifications' },
  routes: {
    rootRoute,
  },
});
