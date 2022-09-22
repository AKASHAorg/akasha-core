require('@testing-library/jest-dom/extend-expect');
import { mockSDK } from '@akashaorg/af-testing';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: key => key }),
}));

jest.mock('@akashaorg/awf-sdk', () => {
  return () => mockSDK();
});
