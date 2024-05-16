import * as React from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { MockedProvider } from '@apollo/client/testing';

import i18n from 'i18next';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  version: '0.1dev',
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'cache-and-network',
    },
  },
});

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

const TranslationProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <React.Suspense fallback="loading">
      <div id="test-translation-provider">
        <I18nextProvider i18n={getI18nInstance()}>{children}</I18nextProvider>
      </div>
    </React.Suspense>
  );
};

const AllProviders: React.FC<{
  children: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
}> = ({ children }) => {
  return (
    <ApolloProvider client={apolloClient}>
      <TranslationProvider>{children}</TranslationProvider>
    </ApolloProvider>
  );
};

/*@TODO replacement for AllProviders when react-query is fully migrated to apollo */
const AllProvidersWithApollo: React.FC<{
  children: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
}> = ({ children }) => {
  return (
    <MockedProvider mocks={[]} addTypename={false}>
      <TranslationProvider>{children}</TranslationProvider>
    </MockedProvider>
  );
};

export { TranslationProvider, AllProviders, AllProvidersWithApollo };
