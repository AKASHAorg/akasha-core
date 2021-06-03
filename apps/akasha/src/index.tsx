import { moduleName as commons } from '@akashaproject/sdk-common/lib/constants';
import { moduleName as dbModule } from '@akashaproject/sdk-db/lib/constants';
import { moduleName as auth } from '@akashaproject/sdk-auth/lib/constants';
import { moduleName as profiles } from '@akashaproject/sdk-profiles/lib/constants';
import { moduleName as posts } from '@akashaproject/sdk-posts/lib/constants';

import routes, { FEED, POST, POSTS, rootRoute, TAGS } from './routes';
import { LogoTypeSource } from '@akashaproject/ui-awf-typings';
import { Widget as TrendingWidget } from './widgets/trending-widget';
import { Widget as ProfileCardWidget } from './widgets/posts-profile-card-widget';
import {
  IAppConfig,
  IntegrationRegistrationOptions,
} from '@akashaproject/ui-awf-typings/lib/app-loader';

const userPostsRoute = `${routes[POSTS]}/:userId`;
const fullPostRoute = `${routes[POST]}/:postId`;
const tagsPostsRoute = `${routes[TAGS]}/:tagName`;

export const register: (opts: IntegrationRegistrationOptions) => IAppConfig = opts => ({
  activeWhen: (location, pathToActiveWhen) => {
    return pathToActiveWhen(rootRoute)(location);
  },
  loadingFn: () => import('./components'),
  mountsIn: opts.layoutConfig.pluginSlotId,
  name: 'akasha-app',
  sdkModules: [
    { module: commons },
    { module: dbModule },
    { module: auth },
    { module: profiles },
    { module: posts },
  ],
  /**
   * routes that are defined here can be used by
   * other apps to navigate
   */
  routes: {
    rootRoute,
  },
  menuItems: routes,
  title: 'Ethereum World',
  logo: { type: LogoTypeSource.ICON, value: 'appAkasha' },
  widgets: {
    [userPostsRoute]: [ProfileCardWidget],
    [fullPostRoute]: [ProfileCardWidget, TrendingWidget],
    [routes[FEED]]: [TrendingWidget],
    [tagsPostsRoute]: [TrendingWidget],
  },
});
