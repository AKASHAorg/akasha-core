import * as React from 'react';
import { I18nextProvider } from 'react-i18next';

import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';

import AppRoutes from './app-routes';

const Application = () => {
  const { getTranslationPlugin } = useRootComponentProps();

  return (
    <React.Suspense fallback={<>Loading</>}>
      <I18nextProvider i18n={getTranslationPlugin().i18n}>
        <AppRoutes />
      </I18nextProvider>
    </React.Suspense>
  );
};

export default Application;
