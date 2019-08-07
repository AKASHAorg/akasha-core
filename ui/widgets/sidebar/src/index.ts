/**
 * All widgets must export an object like this:
 */
export default {
  name: 'ui-plugin-events',
  widget: () => import('./components'),
  services: []
};
