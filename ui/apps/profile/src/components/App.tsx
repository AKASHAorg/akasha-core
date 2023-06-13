import React from 'react';
import AppRoutes from './app-routes';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import { I18nextProvider } from 'react-i18next';
import { RootComponentProps } from '@akashaorg/typings/ui';

const App = (props: RootComponentProps) => {
  return (
    <Box>
      <I18nextProvider i18n={props.plugins['@akashaorg/app-translation']?.translation?.i18n}>
        <AppRoutes {...props} />
      </I18nextProvider>
    </Box>
  );
};

export default App;
