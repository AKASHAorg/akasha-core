import * as React from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { TestThemeProvider } from '@akashaproject/design-system/src/test-utils/providers';
import i18n from 'i18next';

const getI18nInstance = () => {
  i18n.use(initReactI18next).init({
    fallbackLng: 'en',
    ns: ['translations'],
    defaultNS: 'translations',
    debug: false,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: { en: {}, es: {}, de: {} },
  });
  return i18n;
};

const TranslationProvider: React.FC = ({ children }) => {
  return (
    <React.Suspense fallback="loading">
      <div id="test-translation-provider">
        <I18nextProvider i18n={getI18nInstance()}>{children}</I18nextProvider>
      </div>
    </React.Suspense>
  );
};

const AllProviders: React.FC = ({ children }) => {
  return (
    <TranslationProvider>
      <TestThemeProvider>{children}</TestThemeProvider>
    </TranslationProvider>
  );
};

export { TranslationProvider, AllProviders };
