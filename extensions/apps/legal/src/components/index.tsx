import * as React from 'react';
import { I18nextProvider } from 'react-i18next';
import { useRootComponentProps, withProviders } from '@akashaorg/ui-core-hooks';

import { RouterProvider } from '@tanstack/react-router';
import { router } from './app-routes';
import { Loader2 } from 'lucide-react';

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof router>;
  }
}

const App: React.FC<unknown> = () => {
  const { getTranslationPlugin, baseRouteName } = useRootComponentProps();

  return (
    <React.Suspense fallback={<Loader2 className="h-8 w-8 animate-spin text-primary" />}>
      <I18nextProvider i18n={getTranslationPlugin().i18n}>
        <RouterProvider
          router={router({
            baseRouteName,
          })}
        />
      </I18nextProvider>
    </React.Suspense>
  );
};

export default withProviders(App);
