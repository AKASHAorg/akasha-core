import * as useRootComponentProps from '@akashaorg/ui-awf-hooks/lib/use-root-props';
import * as useAkashaStore from '@akashaorg/ui-awf-hooks/lib/store/use-akasha-store';
import { genAppProps, getUserInfo, getUserStore } from '@akashaorg/af-testing';
import '@testing-library/jest-dom';

class ResizeObserver {
  observe() {
    return;
  }
  unobserve() {
    return;
  }
  disconnect() {
    return;
  }
}

global.ResizeObserver = ResizeObserver;

jest.mock('@tanstack/react-router', () => ({
  ...jest.requireActual('@tanstack/react-router'),
  useNavigate: jest.fn().mockImplementation(() => {
    return jest.fn();
  }),
  useRouterState: jest.fn().mockImplementation(() => {
    return {
      location: {
        pathname: '',
      },
    };
  }),
}));

jest.mock('react-use', () => ({
  ...jest.requireActual('react-use'),
  useMedia: jest.fn().mockImplementation(() => {
    return false;
  }),
}));

/**
 * sdk mock for Apps package.
 * Include only methods needed for the apps tests
 *
 */
jest.mock('@akashaorg/awf-sdk', () => () => {
  const { ReplaySubject } = require('rxjs');
  return {
    api: {
      auth: {
        signIn: () => Promise.resolve({ data: { id: 'id' } }),
        signOut: () => Promise.resolve('Logged out'),
        getCurrentUser: () => Promise.resolve({ data: { id: 'id' } }),
      },
      globalChannel: new ReplaySubject(),
    },
    services: {
      gql: {
        mutationNotificationConfig: { optionName: 'testMutationConfig' },
        contextSources: {
          composeDB: Symbol.for('composeDB'),
          default: Symbol.for('defaultContextSource'),
        },
      },
      common: {
        misc: {
          resolveDID: jest.fn(),
        },
      },
      stash: {
        getUiStash: () => new Map(),
      },
    },
  };
});

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: str => str,
      i18n: {
        languages: [],
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
}));

jest.mock('@twind/core', () => {
  return {
    tw: () => {},
    apply: () => {},
    tx: () => {},
  };
});

jest.spyOn(useRootComponentProps, 'useRootComponentProps').mockReturnValue({ ...genAppProps() });

jest
  .spyOn(useAkashaStore, 'useAkashaStore')
  .mockReturnValue({ userStore: getUserStore(), data: getUserInfo() });

const mockIntersectionObserver = jest.fn();

mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});

global.IntersectionObserver = mockIntersectionObserver;

//TODO revisit this mock
global.scrollTo = jest.fn();
