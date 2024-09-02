import { IRootComponentProps } from '@akashaorg/typings/lib/ui';
import { genWorldConfig } from './world-config';
import { uiEventsMock } from '../mocks/uiEvents';
import { Subject } from 'rxjs';

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
export const genAppProps = (): IRootComponentProps & {
  getRoutingPlugin: (ns?: string) => any;
  getTranslationPlugin: (ns?: string) => any;
  getCorePlugins: () => any;
} => ({
  logger: log,
  navigateToModal: () => ({}),
  uiEvents: uiEventsMock,
  layoutSlots: {},
  singleSpa: null,
  worldConfig: genWorldConfig(),
  getRoutingPlugin: () => ({
    routeObserver: new Subject(),
    navigateTo: jest.fn(),
    handleRedirect: jest.fn(),
    getUrlForApp: jest.fn(),
  }),
  getTranslationPlugin: () => ({ i18n: {} }),
  getCorePlugins: () => ({
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
