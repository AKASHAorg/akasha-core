import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import { createRouter } from './app-routes';
import { RouterProvider } from '@tanstack/react-router';

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}

const Application: React.FC<unknown> = () => {
  const { baseRouteName, getTranslationPlugin } = useRootComponentProps();

  return (
    <React.Suspense fallback={<Spinner />}>
      <I18nextProvider i18n={getTranslationPlugin().i18n}>
        <RouterProvider
          router={createRouter({
            baseRouteName,
          })}
        />
      </I18nextProvider>
    </React.Suspense>
  );
};

export default Application;
