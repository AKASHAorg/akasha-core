import { IAppConfig } from '@akashaorg/ui-awf-typings/lib/app-loader';
import { genLifecycles } from '../mocks/single-spa';

export const genAppConfig = (
  overrides?: Partial<IAppConfig & { name: string }>,
): IAppConfig & { name: string } => ({
  name: '@test/integration',
  mountsIn: 'mountsin-node-id',
  activeWhen: () => true,
  routes: { rootRoute: '/test-app/root' },
  menuItems: {
    label: 'menu-item',
    route: '/test-app/root',
  },
  loadingFn: () => genLifecycles(),
  // extends: (matcher, loader) => {
  //   matcher({
  //     'extension-mountsin-node-id': loader(() => Promise.resolve(genLifecycles())),
  //   });
  // },
  ...overrides,
});
