import 'systemjs-webpack-interop/auto-public-path';
import { IWidgetConfig } from '@akashaorg/typings/lib/ui';

/**
 * All widgets must export an object like this:
 */
// export const register: () => IWidgetConfig = () => ({
//   loadingFn: () => import('./components'),
//   activeWhen: () => true,
//   i18nNamespace: ['ui-lib-feed'],
//   /* It does not have a mountsIn property because it's a library */
//   mountsIn: null,
// });
