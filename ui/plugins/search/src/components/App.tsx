import React from 'react';
import DS from '@akashaproject/design-system';
import { I18nextProvider } from 'react-i18next';
import Routes from './routes';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import i18next from '../i18n';

const { Box, Helmet } = DS;

const App: React.FC<RootComponentProps> = props => {
  return (
    <Box width="100vw">
      <I18nextProvider i18n={i18next}>
        <Helmet>
          <title>Search | Ethereum World</title>
        </Helmet>
        <Routes {...props} />
      </I18nextProvider>
    </Box>
  );
};

export default App;
