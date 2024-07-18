import 'systemjs-webpack-interop/auto-public-path';
import { IntegrationRegistrationOptions, WidgetInterface } from '@akashaorg/typings/lib/ui';

export const register = (opts: IntegrationRegistrationOptions): WidgetInterface => ({
  mountsIn: opts.layoutSlots?.contextualWidgetSlotId,
  loadingFn: () => import('./my-apps-widget'),
  activeWhen: '/@akashaorg/app-extensions/',
});
