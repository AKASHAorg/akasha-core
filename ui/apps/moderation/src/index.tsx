import { rootRoute } from './routes';
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
  sdkModules: [],
  // menuItems: routes,
  title: 'Moderator Dashboard | Ethereum World',
  logo: { type: LogoTypeSource.ICON, value: 'appModeration' },
  widgets: {},
  routes: {
    rootRoute,
  },
  extends: [
    {
      mountsIn: 'report-modal',
      loadingFn: () => import('./extensions/report-modal'),
    },
    {
      mountsIn: 'moderate-modal',
      loadingFn: () => import('./extensions/moderate-modal'),
    },
  ],
});
