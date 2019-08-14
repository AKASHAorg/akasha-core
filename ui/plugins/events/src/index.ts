import { Lifecycles } from 'single-spa-react';

/**
 * All the plugins must export an object like this:
 */
export default {
  // This is the root route in which the plugin will render.
  // Make sure to change it as it fits.
  activeWhen: {
    exact: true,
    path: '/events',
  },
  loadingFn: (): Promise<Lifecycles> => import('./components'),
  name: 'ui-plugin-events',
  services: [],
  title: 'AKASHA Events',
};
