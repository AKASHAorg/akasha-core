import {
  IWidgetConfig,
  IntegrationRegistrationOptions,
} from '@akashaproject/ui-awf-typings/lib/app-loader';
/**
 * All widgets must export an object like this:
 */
export const register: (opts: IntegrationRegistrationOptions) => IWidgetConfig = opts => {
  return {
    mountsIn: opts.layoutConfig.staticWidgetSlotId,
    loadingFn: () => import('./components'),
    name: 'ui-widget-analytics',
    tags: ['analytics-widget'],
  };
};
