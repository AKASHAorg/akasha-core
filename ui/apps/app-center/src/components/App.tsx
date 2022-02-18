import * as React from 'react';
import DS from '@akashaproject/design-system';
import { I18nextProvider } from 'react-i18next';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import i18next from '../i18n';
import AppRoutes from './app-routes';

const { Box } = DS;

const App: React.FC<RootComponentProps> = props => {
  return (
    <Box width="100vw">
      <I18nextProvider i18n={i18next}>
        <AppRoutes {...props} />
      </I18nextProvider>
    </Box>
  );
};

export default App;
