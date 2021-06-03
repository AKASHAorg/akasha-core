import { LogoTypeSource } from '@akashaproject/ui-awf-typings';
import { rootRoute } from './routes';
import { Widget as TrendingWidget } from './components/widgets/trending-widget';
import { moduleName as commons } from '@akashaproject/sdk-common/lib/constants';
import { moduleName as dbModule } from '@akashaproject/sdk-db/lib/constants';
import { moduleName as auth } from '@akashaproject/sdk-auth/lib/constants';
import { moduleName as profiles } from '@akashaproject/sdk-profiles/lib/constants';
import { moduleName as posts } from '@akashaproject/sdk-posts/lib/constants';
import {
  IAppConfig,
  IntegrationRegistrationOptions,
} from '@akashaproject/ui-awf-typings/src/app-loader';

const searchRoute = `${rootRoute}/:postId`;

/**
 * All the plugins must export an object like this:
 */
export const register: (opts: IntegrationRegistrationOptions) => IAppConfig = opts => ({
  // This is the root route in which the plugin will render.
  // Make sure to change it as it fits.
  activeWhen: (location, pathToActiveWhen) => {
    return pathToActiveWhen(rootRoute)(location);
  },
  loadingFn: () => import('./components'),
  mountsIn: opts.layoutConfig.pluginSlotId,
  name: 'ui-plugin-search',
  sdkModules: [
    { module: commons },
    { module: auth },
    { module: profiles },
    { module: posts },
    { module: dbModule },
  ],
  title: 'Search | Ethereum World',
  logo: { type: LogoTypeSource.ICON, value: 'search' },
  widgets: {
    [searchRoute]: [TrendingWidget],
  },
  routes: {
    rootRoute,
  },
});
