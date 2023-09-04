import { IAppConfig, INTEGRATION_TYPES } from '@akashaorg/typings/ui';
import { genLifecycles } from '../mocks/single-spa';
import { genWorldConfig } from './world-config';
import { uiEventsMock } from '../mocks/uiEvents';
import { ReleaseInfo } from '@akashaorg/typings/sdk';
import { Subject } from 'rxjs';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';

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

const log: any = {
  info: () => {
    /*  */
  },
  warn: () => {
    /*  */
  },
  error: () => {
    /*  */
  },
};
export const genAppProps = (): ReturnType<typeof useRootComponentProps> => ({
  logger: log,
  navigateToModal: () => ({}),
  uiEvents: uiEventsMock,
  layoutConfig: {},
  singleSpa: null,
  worldConfig: genWorldConfig(),
  getRoutingPlugin: () => ({
    routeObserver: new Subject(),
    navigateTo: jest.fn(),
    handleRedirect: jest.fn(),
    getURlForApp: jest.fn(),
  }),
  getTranslationPlugin: () => ({ i18n: {} }),
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
  manifestData: {
    mainFile: '',
  },
});
