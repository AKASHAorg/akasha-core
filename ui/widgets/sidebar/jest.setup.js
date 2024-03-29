jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: () => ({ t: (key) => key, i18n: { languages: ['en'] } }),
}));
