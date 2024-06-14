import React, { PropsWithChildren } from 'react';
import i18n from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { InMemoryCache } from '@apollo/client';
import { relayStylePagination } from '@apollo/client/utilities';

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

const AllProviders: React.FC<
  PropsWithChildren<{
    providerProps: { mocks: MockedResponse<unknown, unknown>[] };
  }>
> = ({ providerProps, children }) => {
  return (
    <MockedProvider
      mocks={providerProps?.mocks ?? []}
      cache={
        new InMemoryCache({
          typePolicies: {
            AkashaBeam: {
              merge: true,
            },
            AkashaReflectConnection: {
              merge: true,
            },
            AkashaFollow: {
              merge: true,
            },
            CeramicAccount: {
              merge: true,
              fields: {
                akashaFollowList: relayStylePagination(['sorting', 'filters']),
                akashaBeamStreamList: relayStylePagination(['sorting', 'filters']),
                akashaReflectStreamList: relayStylePagination(['sorting', 'filters']),
                akashaBeamList: relayStylePagination(['sorting', 'filters']),
              },
            },
            AkashaProfile: {
              merge: true,
              fields: {
                followers: relayStylePagination(['sorting', 'filters']),
              },
            },
            Query: {
              fields: {
                akashaBeamIndex: relayStylePagination(['sorting', 'filters']),
              },
            },
          },
        })
      }
    >
      <TranslationProvider>{children}</TranslationProvider>
    </MockedProvider>
  );
};

export { TranslationProvider, AllProviders };
