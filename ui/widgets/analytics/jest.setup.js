import '../jest.setup';
import { mockSDK } from '@akashaorg/af-testing';

jest.mock('@akashaorg/awf-sdk', () => {
  return () => mockSDK({});
});

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
