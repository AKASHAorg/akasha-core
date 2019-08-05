import { Lifecycles } from 'single-spa-react';

const pathPrefix = (prefix: string, options?: { exact?: boolean }) => {
  return (location: Location): boolean => {
    if (options && options.exact) {
      return location.pathname === prefix;
    }
    return location.pathname.startsWith(`${prefix}`);
  };
};
/**
 * All the plugins must export an object like this:
 */
export default {
  // This is the root route in which the plugin will render.
  // Make sure to change it as it fits.
  // aaa
  activeWhen: pathPrefix('/events'),
  loadingFn: (): Promise<Lifecycles> => import('./components'),
  name: 'ui-plugin-events',
  services: []
};
