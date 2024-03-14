/* eslint-disable @typescript-eslint/no-empty-function */
import { ReplaySubject } from 'rxjs';
import { genAppProps } from '@akashaorg/af-testing';
import * as useRootComponentProps from '@akashaorg/ui-awf-hooks/lib/use-root-props';

require('@testing-library/jest-dom/extend-expect');

/**
 * sdk mock for Apps package.
 * Include only methods needed for the apps tests
 *
 * using .doMock() here instead of .mock() to fix error about referencing out-of-scope variables.
 */
jest.doMock('@akashaorg/awf-sdk', () => () => ({
  api: {
    auth: {
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
}));

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

jest.spyOn(useRootComponentProps, 'useRootComponentProps').mockReturnValue(genAppProps());
