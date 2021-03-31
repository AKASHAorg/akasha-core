import { Application, LogoTypeSource } from '@akashaproject/ui-awf-typings';
import { initReactI18next } from 'react-i18next';
import routes, { rootRoute, MY_PROFILE } from './routes';
import { Widget as TrendingWidget } from './components/widgets/trending-widget';
import { moduleName as profilesModule } from '@akashaproject/sdk-profiles/lib/constants';
import { moduleName as commonsModule } from '@akashaproject/sdk-common/lib/constants';
import { moduleName as authModule } from '@akashaproject/sdk-auth/lib/constants';
import { moduleName as registryModule } from '@akashaproject/sdk-registry/lib/constants';
import { moduleName as postsModule } from '@akashaproject/sdk-posts/lib/constants';
import { moduleName as dbModule } from '@akashaproject/sdk-db/lib/constants';
/**
 * All the plugins must export an object like this:
 */
export const application: Application = {
  // This is the root route in which the plugin will render.
  // Make sure to change it as it fits.
  activeWhen: {
    path: rootRoute,
  },
  // translation config
  i18nConfig: {
    // namespaces that this plugin requires.
    // The ns is loaded automatically, you need to specify it only if changed
    // Example: i have changed the name of this plugin and the created ns was the old plugin name,
    // In this case I will preserve the old ns instead loading a possibly undefined ns.
    loadNS: [],
    // translation namespace. defaults to plugin.name
    // ns: 'ui-plugin-events',
    // i18next.use(arr[0]).use(arr[1]).use(arr[n])
    use: [initReactI18next],
  },
  loadingFn: (): Promise<any> => import('./components'),
  name: 'ui-plugin-profile',
  sdkModules: [
    { module: profilesModule },
    { module: commonsModule },
    { module: authModule },
    { module: registryModule },
    { module: postsModule },
    { module: dbModule },
  ],
  title: 'AKASHA Profile',
  menuItems: routes,
  logo: { type: LogoTypeSource.AVATAR, value: '' },
  widgets: {
    [`${routes[MY_PROFILE]}`]: [TrendingWidget],
    [`${routes[MY_PROFILE]}/:any?`]: [TrendingWidget],
    [`${rootRoute}/:profileId`]: [TrendingWidget],
    [`${rootRoute}/:profileId/:any?`]: [TrendingWidget],
  },
};
