import 'systemjs-webpack-interop/auto-public-path';
import { IntegrationRegistrationOptions, WidgetInterface } from '@akashaorg/typings/lib/ui';

export const register = (opts: IntegrationRegistrationOptions): WidgetInterface => ({
  mountsIn: opts.layoutSlots?.contextualWidgetSlotId,
  loadingFn: () => import('./mini-profile-widget'),
  activeWhen: (location, pathToActiveWhen) => {
    if (location.pathname.includes('/reflection')) {
      return pathToActiveWhen('/@akashaorg/app-antenna/reflection/', false)(location);
    }
    return pathToActiveWhen('/@akashaorg/app-antenna/beam/', false)(location);
  },
});
