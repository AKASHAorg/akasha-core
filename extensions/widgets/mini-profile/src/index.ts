import 'systemjs-webpack-interop/auto-public-path';
import { IntegrationRegistrationOptions, WidgetInterface } from '@akashaorg/typings/lib/ui';

export const register = (opts: IntegrationRegistrationOptions): WidgetInterface => ({
  mountsIn: opts.layoutSlots?.contextualWidgetSlotId,
  loadingFn: () => import('./mini-profile-widget'),
  activeWhen: ['/@akashaorg/app-antenna/reflection/', '/@akashaorg/app-antenna/beam/'],
});
