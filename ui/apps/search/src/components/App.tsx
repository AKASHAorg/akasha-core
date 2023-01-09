import React from 'react';
import DS from '@akashaorg/design-system';
import { I18nextProvider } from 'react-i18next';
import { RootComponentProps } from '@akashaorg/typings/ui';
import AppRoutes from './routes';

const { Box, Helmet } = DS;

const App: React.FC<RootComponentProps> = props => {
  return (
    <Box>
      <I18nextProvider i18n={props.plugins['@akashaorg/app-translation']?.translation?.i18n}>
        <Helmet>
          <title>Search | Ethereum World</title>
        </Helmet>
        <AppRoutes {...props} />
      </I18nextProvider>
    </Box>
  );
};

export default App;
