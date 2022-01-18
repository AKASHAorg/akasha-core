jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));
