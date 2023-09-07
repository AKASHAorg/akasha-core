/* eslint-disable @typescript-eslint/no-empty-function */
import { mockSDK, genAppProps } from '@akashaorg/af-testing';
import * as useRootComponentProps from '@akashaorg/ui-awf-hooks/lib/use-root-props';

require('@testing-library/jest-dom/extend-expect');

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

jest.mock('@akashaorg/awf-sdk', () => {
  return () => mockSDK({});
});

jest.mock('@twind/core', () => {
  return {
    tw: () => {},
    apply: () => {},
    tx: () => {},
  };
});

jest.spyOn(useRootComponentProps, 'useRootComponentProps').mockReturnValue(genAppProps());
