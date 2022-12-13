import React from 'react';
import DS from '@akashaorg/design-system';
import AppRoutes from './app-routes';
import { RootComponentProps } from '@akashaorg/typings/ui';
import { I18nextProvider } from 'react-i18next';

const { Box } = DS;
const App: React.FC<RootComponentProps> = props => {
  return (
    <Box width="100vw">
      <I18nextProvider i18n={props.plugins['@akashaorg/app-translation']?.translation?.i18n}>
        <AppRoutes {...props} />
      </I18nextProvider>
    </Box>
  );
};

export default App;
