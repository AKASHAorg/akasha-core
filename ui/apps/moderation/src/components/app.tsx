import React from 'react';
import { I18nextProvider } from 'react-i18next';

import { RootComponentProps } from '@akashaorg/typings/ui';

import Box from '@akashaorg/design-system-core/lib/components/Box';

import AppRoutes from './app-routes';

const Application: React.FC<RootComponentProps> = props => {
  return (
    <Box>
      <React.Suspense fallback={<>Loading</>}>
        <I18nextProvider i18n={props.plugins['@akashaorg/app-translation']?.translation?.i18n}>
          <AppRoutes {...props} />
        </I18nextProvider>
      </React.Suspense>
    </Box>
  );
};

export default Application;
