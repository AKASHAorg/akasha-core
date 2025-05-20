import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { RouterProvider } from '@tanstack/react-router';
import { useRootComponentProps, withProviders } from '@akashaorg/ui-core-hooks';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Loader2 } from 'lucide-react';
import { router } from './app-routes';

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof router>;
  }
}

const App: React.FC<unknown> = () => {
  const { baseRouteName, getTranslationPlugin, worldConfig } = useRootComponentProps();

  return (
    <React.Suspense fallback={<Loader2 className="h-8 w-8 animate-spin text-primary" />}>
      <HelmetProvider>
        <I18nextProvider i18n={getTranslationPlugin().i18n}>
          <Helmet>
            <title>Vibes | {worldConfig.title}</title>
          </Helmet>
          <RouterProvider
            router={router({
              baseRouteName,
            })}
          />
        </I18nextProvider>
      </HelmetProvider>
    </React.Suspense>
  );
};

export default withProviders(App);
