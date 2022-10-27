import { IAppConfig, INTEGRATION_TYPES, RootComponentProps } from '@akashaorg/typings/ui';
import { genLifecycles } from '../mocks/single-spa';
import { genWorldConfig } from './world-config';
import { uiEventsMock } from '../mocks/uiEvents';
import { ReleaseInfo } from '@akashaorg/typings/sdk';

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

export const genAppProps = (): RootComponentProps => ({
  logger: {
    info: () => {
      /*  */
    },
    warn: () => {
      /*  */
    },
    error: () => {
      /*  */
    },
    setLevel: () => {
      /*  */
    },
  },
  navigateToModal: () => ({}),
  uiEvents: uiEventsMock,
  layoutConfig: {},
  singleSpa: null,
  worldConfig: genWorldConfig(),
  parseQueryString: () => ({}),
  plugins: {},
  baseRouteName: '',
  domElement: null,
  encodeAppName: name => name,
  decodeAppName: name => name,
});

export const genReleaseInfo = (): ReleaseInfo => ({
  integrationID: 'iu9385acnr',
  id: 'id',
  name: 'release name',
  version: 'version',
  integrationType: INTEGRATION_TYPES.APPLICATION,
  sources: [''],
  author: 'author',
  enabled: true,
});
