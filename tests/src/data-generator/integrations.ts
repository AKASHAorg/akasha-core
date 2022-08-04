import { IAppConfig } from '@akashaorg/typings/ui';
import { genLifecycles } from '../mocks/single-spa';

export const genAppConfig = (
  overrides?: Partial<IAppConfig & { name: string }>,
  extendsObj?: [string, () => Promise<any>],
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
  extends: (matcher, loader) => {
    matcher({ [extendsObj[0]]: loader(extendsObj[1]) });
  },
  ...overrides,
});
