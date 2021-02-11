import { Application, LogoTypeSource } from '@akashaproject/ui-awf-typings';
import { initReactI18next } from 'react-i18next';
import { rootRoute } from './routes';
import { Widget as TrendingWidget } from './components/widgets/trending-widget';
import { moduleName as commons } from '@akashaproject/sdk-common/lib/constants';
import { moduleName as dbModule } from '@akashaproject/sdk-db/lib/constants';
import { moduleName as auth } from '@akashaproject/sdk-auth/lib/constants';
import { moduleName as profiles } from '@akashaproject/sdk-profiles/lib/constants';
import { moduleName as posts } from '@akashaproject/sdk-posts/lib/constants';

const searchRoute = `${rootRoute}/:postId`;

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
  name: 'ui-plugin-search',
  sdkModules: [
    { module: commons },
    { module: auth },
    { module: profiles },
    { module: posts },
    { module: dbModule },
  ],
  title: 'Search',
  logo: { type: LogoTypeSource.ICON, value: 'search' },
  widgets: {
    [searchRoute]: [TrendingWidget],
  },
};
