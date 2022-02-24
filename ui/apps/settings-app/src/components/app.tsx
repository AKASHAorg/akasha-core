import * as React from 'react';
import DS from '@akashaproject/design-system';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { I18nextProvider } from 'react-i18next';

import AppRoutes from './app-routes';

const { Box } = DS;

const Application: React.FC<RootComponentProps> = props => {
  return (
    <Box width="100vw">
      <React.Suspense fallback={<>Loading</>}>
        <I18nextProvider i18n={props.plugins?.translation?.i18n}>
          <AppRoutes {...props} />
        </I18nextProvider>
      </React.Suspense>
    </Box>
  );
};

export default Application;
