import { moduleName as commons } from '@akashaproject/sdk-common/lib/constants';
import { moduleName as dbModule } from '@akashaproject/sdk-db/lib/constants';
import { moduleName as auth } from '@akashaproject/sdk-auth/lib/constants';
import { moduleName as profiles } from '@akashaproject/sdk-profiles/lib/constants';
import { moduleName as posts } from '@akashaproject/sdk-posts/lib/constants';

import { initReactI18next } from 'react-i18next';
import routes, { FEED, POST, POSTS, rootRoute, TAGS } from './routes';
import { Application, LogoTypeSource } from '@akashaproject/ui-awf-typings';
import { Widget as TrendingWidget } from './widgets/trending-widget';
import { Widget as ProfileCardWidget } from './widgets/posts-profile-card-widget';

const userPostsRoute = `${routes[POSTS]}/:userId`;
const fullPostRoute = `${routes[POST]}/:postId`;
const tagsPostsRoute = `${routes[TAGS]}/:tagName`;

export const application: Application = {
  activeWhen: {
    path: rootRoute,
  },
  i18nConfig: {
    loadNS: [],
    use: [initReactI18next],
  },
  loadingFn: () => import('./components'),
  name: 'akasha-app',
  sdkModules: [
    { module: commons },
    { module: dbModule },
    { module: auth },
    { module: profiles },
    { module: posts },
  ],
  menuItems: routes,
  title: 'Ethereum World',
  logo: { type: LogoTypeSource.ICON, value: 'appAkasha' },
  widgets: {
    [userPostsRoute]: [ProfileCardWidget],
    [fullPostRoute]: [ProfileCardWidget, TrendingWidget],
    [routes[FEED]]: [TrendingWidget],
    [tagsPostsRoute]: [TrendingWidget],
  },
};
