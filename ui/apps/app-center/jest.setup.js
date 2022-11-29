import { mockSDK } from '@akashaorg/af-testing';

require('@testing-library/jest-dom/extend-expect');
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: key => key, i18n: { languages: ['en'] } }),
  I18nextProvider: ({ children }) => <div>{children}</div>,
}));

jest.mock('@akashaorg/awf-sdk', () => {
  return () => mockSDK();
});
