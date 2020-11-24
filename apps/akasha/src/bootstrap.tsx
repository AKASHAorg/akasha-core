import { moduleName as commons } from '@akashaproject/sdk-common/lib/constants';
import { moduleName as dbModule } from '@akashaproject/sdk-db/lib/constants';
import { moduleName as auth } from '@akashaproject/sdk-auth/lib/constants';
import { moduleName as profiles } from '@akashaproject/sdk-profiles/lib/constants';

import { initReactI18next } from 'react-i18next';
import routes, { FEED, NEW_POST, POSTS, rootRoute } from './routes';
import { Application, LogoTypeSource } from '@akashaproject/ui-awf-typings';
import { Widget as NewPostWohoo } from './widgets/new-post-wohoo';
import { Widget as NewPostTerms } from './widgets/new-post-terms';
import { Widget as NewPostCommunityGuidelines } from './widgets/new-post-community-guidelines';
import { Widget as TrendingWidget } from './widgets/trending-widget';
import { Widget as ProfileCardWidget } from './widgets/posts-profile-card-widget';

const myPostsRoute = `${routes[POSTS]}/my-posts`;
const userPostsRoute = `${routes[POSTS]}/:userId`;
const fullPostRoute = `${routes[POSTS]}/:userId/post/:postId`;

export const application: Application = {
  activeWhen: {
    path: rootRoute,
  },
  i18nConfig: {
    loadNS: [],
    use: [initReactI18next],
  },
  loadingFn: (): Promise<any> => import('./components'),
  name: 'akasha-app',
  sdkModules: [{ module: commons }, { module: dbModule }, { module: auth }, { module: profiles }],
  menuItems: routes,
  title: 'AKASHA',
  logo: { type: LogoTypeSource.ICON, value: 'appAkasha' },
  widgets: {
    [routes[NEW_POST]]: [NewPostWohoo, NewPostTerms, NewPostCommunityGuidelines],
    [routes[FEED]]: [TrendingWidget],
    [myPostsRoute]: [ProfileCardWidget],
    [userPostsRoute]: [ProfileCardWidget],
    [fullPostRoute]: [ProfileCardWidget],
  },
};
