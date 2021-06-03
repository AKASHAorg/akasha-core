import { LogoTypeSource } from '@akashaproject/ui-awf-typings';
import routes, { rootRoute, MY_PROFILE } from './routes';
import { Widget as TrendingWidget } from './components/widgets/trending-widget';
import { moduleName as profilesModule } from '@akashaproject/sdk-profiles/lib/constants';
import { moduleName as commonsModule } from '@akashaproject/sdk-common/lib/constants';
import { moduleName as authModule } from '@akashaproject/sdk-auth/lib/constants';
import { moduleName as registryModule } from '@akashaproject/sdk-registry/lib/constants';
import { moduleName as postsModule } from '@akashaproject/sdk-posts/lib/constants';
import { moduleName as dbModule } from '@akashaproject/sdk-db/lib/constants';
import {
  IAppConfig,
  IntegrationRegistrationOptions,
} from '@akashaproject/ui-awf-typings/src/app-loader';
/**
 * All the plugins must export an object like this:
 */
export const register: (opts: IntegrationRegistrationOptions) => IAppConfig = opts => ({
  // This is the root route in which the plugin will render.
  // Make sure to change it as it fits.
  activeWhen: (location, pathToActiveWhen) => {
    return pathToActiveWhen(rootRoute)(location);
  },
  mountsIn: opts.layoutConfig.pluginSlotId,
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
  widgets: {
    [`${routes[MY_PROFILE]}`]: [TrendingWidget],
    [`${routes[MY_PROFILE]}/:any?`]: [TrendingWidget],
    [`${rootRoute}/:profileId`]: [TrendingWidget],
    [`${rootRoute}/:profileId/:any?`]: [TrendingWidget],
  },
  routes: {
    rootRoute,
  },
});
