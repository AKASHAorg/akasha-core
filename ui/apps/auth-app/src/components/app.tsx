import * as React from 'react';
import { RootComponentProps } from '@akashaorg/typings/ui';
import { I18nextProvider } from 'react-i18next';

import AppRoutes from './app-routes';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';

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
