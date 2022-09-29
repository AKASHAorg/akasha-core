import { mockSDK } from '@akashaorg/af-testing';

require('@testing-library/jest-dom/extend-expect');
jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: str => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
}));

jest.mock('@akashaorg/awf-sdk', () => {
  return () => mockSDK({});
});

jest.mock('@akashaorg/typings/ui', () => ({
  EntityTypes: {
    ENTRY: 0,
    PROFILE: 1,
    COMMENT: 2,
    TAG: 3,
  },
}));

const mockIntersectionObserver = jest.fn();

mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;
