import * as React from 'react';
import { I18nextProvider } from 'react-i18next';
import { TestThemeProvider } from '@akashaproject/design-system/src/test-utils/providers';
import i18n from 'i18next';

jest.unmock('react-i18next');
jest.unmock('i18next');

const instance: any = {
  language: 'en',
  languages: ['en', 'fr'],
  services: {
    resourceStore: {
      data: {},
    },
    backendConnector: { backend: {}, state: {} },
  },
  isInitialized: true,
  changeLanguage: () => {},
  getFixedT: () => (message: string) => message,
  hasResourceBundle: (_lng: string, ns: string) => ns === 'translation',
  loadNamespaces: () => {},
  on: () => {},
  off: () => {},
  options: {},
};

const TranslationProvider: React.FC = ({ children }) => {
  return (
    <React.Suspense fallback="loading">
      <div id="test-translation-provider">
        <I18nextProvider i18n={instance as typeof i18n}>{children}</I18nextProvider>
      </div>
    </React.Suspense>
  );
};

const AllProviders: React.FC = ({ children }) => {
  console.log(TestThemeProvider, 'tt provi');
  return (
    <TranslationProvider>
      <TestThemeProvider>{children}</TestThemeProvider>
    </TranslationProvider>
  );
};

export { TranslationProvider, AllProviders };
