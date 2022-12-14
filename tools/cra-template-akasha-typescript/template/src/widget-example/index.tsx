import 'systemjs-webpack-interop/auto-public-path';
import { IntegrationRegistrationOptions, IWidgetConfig } from '@akashaorg/typings/ui';

export const register: (opts: IntegrationRegistrationOptions) => IWidgetConfig = opts => {
  return {
    mountsIn: opts.layoutConfig.rootWidgetSlotId || '',
    loadingFn: () => import('./components'),
    activeWhen: (location, pathToActiveWhen) => {
      return pathToActiveWhen('/@akashaorg/app-example', false)(location);
    },
    i18nNamespace: ['widget-example'],
    tags: ['example-tag'],
  };
};
