const { mockSDK } = require('@akashaorg/af-testing');

require('@testing-library/jest-dom/extend-expect');
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: key => key, i18n: { languages: ['en'] } }),
}));

jest.mock('@akashaorg/awf-sdk', () => {
  return () => mockSDK();
});
