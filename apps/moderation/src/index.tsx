import { moduleName as commons } from '@akashaproject/sdk-common/lib/constants';
import { moduleName as dbModule } from '@akashaproject/sdk-db/lib/constants';
import { moduleName as auth } from '@akashaproject/sdk-auth/lib/constants';
import { moduleName as profiles } from '@akashaproject/sdk-profiles/lib/constants';
import routes, { rootRoute } from './routes';
import { LogoTypeSource } from '@akashaproject/ui-awf-typings';
import {
  IAppConfig,
  IntegrationRegistrationOptions,
} from '@akashaproject/ui-awf-typings/lib/app-loader';

export const register: (opts: IntegrationRegistrationOptions) => IAppConfig = opts => ({
  activeWhen: (location, pathToActiveWhen) => {
    return pathToActiveWhen(rootRoute)(location);
  },
  loadingFn: () => import('./components'),
  mountsIn: opts.layoutConfig?.pluginSlotId,
  name: 'moderation-app',
  sdkModules: [
    { module: commons },
    { module: dbModule },
    { module: auth },
    { module: profiles },
    { module: 'posts' },
  ],
  menuItems: routes,
  title: 'Moderator Dashboard | Ethereum World',
  logo: { type: LogoTypeSource.ICON, value: 'appModeration' },
  widgets: {},
  routes: {
    rootRoute,
  },
});
