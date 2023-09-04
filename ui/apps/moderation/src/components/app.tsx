import React from 'react';
import { I18nextProvider } from 'react-i18next';

import { RootComponentProps } from '@akashaorg/typings/ui';

import Stack from '@akashaorg/design-system-core/lib/components/Stack';

import AppRoutes from './app-routes';

const Application: React.FC<RootComponentProps> = props => {
  return (
    <Stack>
      <React.Suspense fallback={<>Loading</>}>
        <I18nextProvider i18n={props.plugins['@akashaorg/app-translation']?.translation?.i18n}>
          <AppRoutes {...props} />
        </I18nextProvider>
      </React.Suspense>
    </Stack>
  );
};

export default Application;
