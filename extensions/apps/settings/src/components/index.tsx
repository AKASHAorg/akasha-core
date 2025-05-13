import * as React from 'react';
import { I18nextProvider } from 'react-i18next';
import { useRootComponentProps, withProviders } from '@akashaorg/ui-core-hooks';
import { Loader2 } from 'lucide-react';

import { RouterProvider } from '@tanstack/react-router';
import { router } from './app-routes';
import { Helmet, HelmetProvider } from 'react-helmet-async';

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof router>;
  }
}

const Application: React.FC<unknown> = () => {
  const { getTranslationPlugin, baseRouteName, worldConfig } = useRootComponentProps();

  return (
    <React.StrictMode>
      <React.Suspense fallback={<Loader2 className="h-8 w-8 animate-spin text-primary" />}>
        <HelmetProvider>
          <I18nextProvider i18n={getTranslationPlugin().i18n}>
            <Helmet>
              <title>Settings | {worldConfig.title}</title>
            </Helmet>
            <RouterProvider
              router={router({
                baseRouteName,
              })}
            />
          </I18nextProvider>
        </HelmetProvider>
      </React.Suspense>
    </React.StrictMode>
  );
};

export default withProviders(Application);
