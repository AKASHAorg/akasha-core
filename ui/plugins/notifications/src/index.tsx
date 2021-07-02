import { LogoTypeSource } from '@akashaproject/ui-awf-typings';
import { rootRoute } from './routes';
import { IAppConfig } from '@akashaproject/ui-awf-typings/src/app-loader';

/**
 * All the plugins must export an object like this:
 */
export const register: () => IAppConfig = () => ({
  // This is the root route in which the plugin will render.
  // Make sure to change it as it fits.
  activeWhen: (location, pathToActiveWhen) => {
    return pathToActiveWhen(rootRoute)(location);
  },
  loadingFn: () => import('./components'),
  name: 'ui-plugin-notifications',
  title: 'Notifications | Ethereum World',
  logo: { type: LogoTypeSource.ICON, value: 'notifications' },
  routes: {
    rootRoute,
  },
});
