import routes, { POST, rootRoute } from './routes';
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
  name: 'app-akasha-integration',

  /**
   * routes that are defined here can be used by
   * other apps to navigate
   */
  routes: {
    rootRoute,
  },
  title: 'Ethereum World',
  logo: { type: LogoTypeSource.ICON, value: 'appAkasha' },
  extends: [
    {
      mountsIn: 'entry-remove-confirmation',
      loadingFn: () => import('./extensions/entry-remove-modal'),
    },
    {
      mountsIn: 'editor',
      loadingFn: () => import('./extensions/editor-modal'),
    },
    {
      mountsIn: opts => {
        if (opts.extensionData && opts.extensionData.name.startsWith('entry-card-edit-button')) {
          return opts.extensionData.name;
        }
      },
      loadingFn: () => import('./extensions/entry-edit-button'),
    },
    {
      mountsIn: opts.layoutConfig.widgetSlotId,
      activeWhen: (location, pathToActiveWhen) => {
        return pathToActiveWhen(routes[POST])(location);
      },
      loadingFn: () => import('./extensions/profile-card-widget'),
    },
  ],
});
