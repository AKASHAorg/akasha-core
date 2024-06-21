import { IAppConfig, RootComponentProps } from '@akashaorg/typings/lib/ui';
import { genLifecycles } from '../mocks/single-spa';
import { genWorldConfig } from './world-config';
import { uiEventsMock } from '../mocks/uiEvents';
import { ExtensionConfig } from '@akashaorg/typings/lib/ui';
import { Subject } from 'rxjs';
import { AkashaAppApplicationType } from '@akashaorg/typings/lib/sdk/graphql-types-new';

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
export const genAppProps = (): RootComponentProps & {
  getRoutingPlugin: (ns?: string) => any;
  getTranslationPlugin: (ns?: string) => any;
  getExtensionsPlugin: () => any;
} => ({
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
    getUrlForApp: jest.fn(),
  }),
  getTranslationPlugin: () => ({ i18n: {} }),
  getExtensionsPlugin: () => ({
    //TODO revisit this mock
    contentBlockStore: {
      getMatchingBlocks: () => [],
    },
  }),
  parseQueryString: () => ({}),
  plugins: {},
  baseRouteName: '',
  domElement: null,
  encodeAppName: name => name,
  decodeAppName: name => name,
  getModalFromParams: () => ({ name: 'test-modal' }),
});

export const genReleaseInfo = (): ExtensionConfig => ({
  integrationID: 'iu9385acnr',
  id: 'id',
  name: 'release name',
  version: 'version',
  integrationType: AkashaAppApplicationType.App,
  sources: [''],
  author: 'author',
  enabled: true,
  manifestData: {
    mainFile: '',
  },
});
