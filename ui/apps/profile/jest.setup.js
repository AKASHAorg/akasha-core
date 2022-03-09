require('@testing-library/jest-dom/extend-expect');
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: key => key, i18n: { languages: ['en'] } }),
}));
