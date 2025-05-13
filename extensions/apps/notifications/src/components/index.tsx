import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { useRootComponentProps, withProviders } from '@akashaorg/ui-core-hooks';
import { Loader2 } from 'lucide-react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './app-routes/index';
import { useApolloClient } from '@apollo/client';

const App: React.FC<unknown> = () => {
  const { getTranslationPlugin, baseRouteName, worldConfig } = useRootComponentProps();
  const apolloClient = useApolloClient();

  return (
    <React.StrictMode>
      <React.Suspense fallback={<Loader2 className="h-8 w-8 animate-spin text-primary" />}>
        <HelmetProvider>
          <I18nextProvider i18n={getTranslationPlugin().i18n}>
            <Helmet>
              <title>Notifications | {worldConfig.title}</title>
            </Helmet>
            <RouterProvider
              router={router({
                baseRouteName,
                apolloClient,
              })}
            />
          </I18nextProvider>
        </HelmetProvider>
      </React.Suspense>
    </React.StrictMode>
  );
};

export default withProviders(App);
