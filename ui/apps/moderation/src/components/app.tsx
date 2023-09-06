import React from 'react';
import { I18nextProvider } from 'react-i18next';

import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';

import Box from '@akashaorg/design-system-core/lib/components/Box';

import AppRoutes from './app-routes';

const Application: React.FC<unknown> = () => {
  const { getTranslationPlugin } = useRootComponentProps();

  return (
    <Box>
      <React.Suspense fallback={<>Loading</>}>
        <I18nextProvider i18n={getTranslationPlugin().i18n}>
          <AppRoutes />
        </I18nextProvider>
      </React.Suspense>
    </Box>
  );
};

export default Application;
